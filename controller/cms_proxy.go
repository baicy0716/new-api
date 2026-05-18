package controller

import (
	"context"
	"errors"
	"io"
	"net/http"
	"net/url"
	"path"
	"regexp"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

const (
	cmsProxyBaseURL   = "https://api.kuaigouai.com"
	cmsProxyBodyLimit = 2 << 20
)

var (
	cmsMainPattern = regexp.MustCompile(`(?is)<main[^>]*>(.*?)</main>`)
	cmsBodyPattern = regexp.MustCompile(`(?is)<body[^>]*>(.*?)</body>`)
	cmsFooterPattern = regexp.MustCompile(`(?is)<footer[^>]*>.*?</footer>`)
	cmsTitlePattern = regexp.MustCompile(`(?is)<title>(.*?)</title>`)
	cmsDescPattern = regexp.MustCompile(`(?is)<meta[^>]+name=["']description["'][^>]+content=["'](.*?)["'][^>]*>`)
	cmsStylePattern = regexp.MustCompile(`(?is)<style[^>]*>(.*?)</style>`)
	cmsScriptPattern = regexp.MustCompile(`(?is)<script[^>]*>.*?</script>`)
	cmsStylesheetPattern = regexp.MustCompile(`(?is)<link[^>]*href=["']([^"']+)["'][^>]*rel=["']stylesheet["'][^>]*>|<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>`)
)

var cmsAllowedPrefixes = []string{
	"/share/",
	"/share/about",
	"/share/changelog",
	"/share/faq",
	"/share/marketplace",
	"/share/models",
	"/share/playground",
	"/share/pricing",
	"/share/services",
	"/share/share",
	"/share/tools",
}

type cmsPagePayload struct {
	Path        string   `json:"path"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	HTML        string   `json:"html"`
	FooterHTML  string   `json:"footerHtml"`
	Styles      string   `json:"styles"`
	Stylesheets []string `json:"stylesheets"`
}

func normalizeCMSPath(raw string) (string, error) {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return "/share/", nil
	}
	if !strings.HasPrefix(raw, "/") {
		raw = "/" + raw
	}
	parsed, err := url.Parse(raw)
	if err != nil {
		return "", err
	}
	clean := path.Clean(parsed.Path)
	if clean == "." {
		clean = "/"
	}
	if parsed.Path == "/share/" || clean == "/share" {
		clean = "/share/"
	}
	if strings.HasSuffix(parsed.Path, "/") && clean != "/" && !strings.HasSuffix(clean, "/") {
		clean += "/"
	}
	if !strings.HasPrefix(clean, "/share") {
		return "", errors.New("invalid cms path")
	}
	return clean, nil
}

func isAllowedCMSPath(p string) bool {
	switch p {
	case "/share/login", "/share/register", "/share/console":
		return false
	}

	for _, prefix := range cmsAllowedPrefixes {
		if p == prefix {
			return true
		}
		if prefix != "/share/" && strings.HasPrefix(p, prefix+"/") {
			return true
		}
	}
	return false
}

func rewriteCMSMarkup(content string) string {
	replacer := strings.NewReplacer(
		"https://api.kuaigouai.com/share/", "/share/",
		"https://api.kuaigouai.com/share", "/share",
		"http://api.kuaigouai.com/share/", "/share/",
		"http://api.kuaigouai.com/share", "/share",
		"/hare/register", "/share/register",
	)
	return replacer.Replace(content)
}

func extractFirstMatch(pattern *regexp.Regexp, content string) string {
	match := pattern.FindStringSubmatch(content)
	if len(match) < 2 {
		return ""
	}
	return strings.TrimSpace(match[1])
}

func extractStylesheets(content string) []string {
	matches := cmsStylesheetPattern.FindAllStringSubmatch(content, -1)
	if len(matches) == 0 {
		return nil
	}

	stylesheets := make([]string, 0, len(matches))
	seen := make(map[string]struct{}, len(matches))

	for _, match := range matches {
		href := strings.TrimSpace(match[1])
		if href == "" && len(match) > 2 {
			href = strings.TrimSpace(match[2])
		}
		if href == "" {
			continue
		}
		if !strings.HasPrefix(href, "http://") && !strings.HasPrefix(href, "https://") {
			continue
		}
		if _, ok := seen[href]; ok {
			continue
		}
		seen[href] = struct{}{}
		stylesheets = append(stylesheets, href)
	}

	return stylesheets
}

func extractInlineStyles(content string) string {
	matches := cmsStylePattern.FindAllStringSubmatch(content, -1)
	if len(matches) == 0 {
		return ""
	}

	parts := make([]string, 0, len(matches))
	for _, match := range matches {
		if len(match) < 2 {
			continue
		}
		css := strings.TrimSpace(match[1])
		if css == "" {
			continue
		}
		parts = append(parts, css)
	}

	return strings.Join(parts, "\n\n")
}

func GetCMSPage(c *gin.Context) {
	cmsPath, err := normalizeCMSPath(c.Query("path"))
	if err != nil || !isAllowedCMSPath(cmsPath) {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "无效的 CMS 页面路径",
		})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 12*time.Second)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, cmsProxyBaseURL+cmsPath, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "创建 CMS 请求失败",
		})
		return
	}
	req.Header.Set("User-Agent", "KuaiGouAI-Staging-CMS-Proxy/1.0")
	req.Header.Set("Accept", "text/html,application/xhtml+xml")

	client := &http.Client{Timeout: 12 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"success": false,
			"message": "拉取 CMS 页面失败",
		})
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		c.JSON(http.StatusBadGateway, gin.H{
			"success": false,
			"message": "CMS 页面返回异常状态",
		})
		return
	}

	body, err := io.ReadAll(io.LimitReader(resp.Body, cmsProxyBodyLimit))
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"success": false,
			"message": "读取 CMS 页面失败",
		})
		return
	}

	rawHTML := rewriteCMSMarkup(string(body))
	mainHTML := extractFirstMatch(cmsMainPattern, rawHTML)
	if mainHTML == "" {
		mainHTML = extractFirstMatch(cmsBodyPattern, rawHTML)
	}
	mainHTML = cmsScriptPattern.ReplaceAllString(mainHTML, "")
	styles := rewriteCMSMarkup(extractInlineStyles(rawHTML))

	payload := cmsPagePayload{
		Path:        cmsPath,
		Title:       extractFirstMatch(cmsTitlePattern, rawHTML),
		Description: extractFirstMatch(cmsDescPattern, rawHTML),
		HTML:        strings.TrimSpace(mainHTML),
		FooterHTML:  strings.TrimSpace(cmsFooterPattern.FindString(rawHTML)),
		Styles:      strings.TrimSpace(styles),
		Stylesheets: extractStylesheets(rawHTML),
	}

	if payload.HTML == "" {
		c.JSON(http.StatusBadGateway, gin.H{
			"success": false,
			"message": "CMS 页面内容为空",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data":    payload,
	})
}
