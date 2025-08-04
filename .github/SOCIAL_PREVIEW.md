# Social Media Preview Optimization

This file contains meta tags and configurations for optimizing how the n8n Workflow Builder MCP Server repository appears when shared on social media platforms.

## Open Graph Meta Tags

```html
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://github.com/makafeli/n8n-workflow-builder">
<meta property="og:title" content="n8n Workflow Builder MCP Server - AI Assistant Integration for n8n Automation">
<meta property="og:description" content="Connect Claude Desktop, ChatGPT, and other AI assistants directly to your n8n instance for seamless workflow management, creation, and execution through natural language commands.">
<meta property="og:image" content="https://raw.githubusercontent.com/makafeli/n8n-workflow-builder/main/.github/assets/social-preview.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="n8n Workflow Builder MCP Server - AI-powered workflow automation">
<meta property="og:site_name" content="GitHub">
<meta property="og:locale" content="en_US">

<!-- Article specific (for blog posts) -->
<meta property="article:author" content="makafeli">
<meta property="article:section" content="Technology">
<meta property="article:tag" content="n8n">
<meta property="article:tag" content="AI">
<meta property="article:tag" content="automation">
<meta property="article:tag" content="MCP">
<meta property="article:tag" content="workflow">
```

## Twitter Card Meta Tags

```html
<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://github.com/makafeli/n8n-workflow-builder">
<meta property="twitter:title" content="n8n Workflow Builder MCP Server - AI Assistant Integration">
<meta property="twitter:description" content="Connect AI assistants like Claude Desktop to n8n for natural language workflow automation. Create, manage, and execute workflows through conversation.">
<meta property="twitter:image" content="https://raw.githubusercontent.com/makafeli/n8n-workflow-builder/main/.github/assets/social-preview.png">
<meta property="twitter:image:alt" content="n8n Workflow Builder MCP Server - AI-powered workflow automation">
<meta property="twitter:creator" content="@makafeli">
<meta property="twitter:site" content="@github">
```

## LinkedIn Optimization

```html
<!-- LinkedIn specific -->
<meta property="linkedin:owner" content="makafeli">
<meta property="linkedin:title" content="n8n Workflow Builder MCP Server - Enterprise AI Automation">
<meta property="linkedin:description" content="Professional-grade AI assistant integration for n8n workflow automation. Streamline business processes with natural language commands and intelligent workflow management.">
```

## Social Preview Image Specifications

### Recommended Dimensions:
- **Facebook/LinkedIn**: 1200x630px (1.91:1 ratio)
- **Twitter**: 1200x600px (2:1 ratio)
- **GitHub**: 1280x640px (2:1 ratio)

### Design Elements:
- **Background**: Professional gradient (n8n brand colors)
- **Logo**: n8n logo + MCP icon + AI assistant icons
- **Title**: "n8n Workflow Builder MCP Server"
- **Subtitle**: "AI Assistant Integration for Workflow Automation"
- **Features**: Key benefits (Natural Language, AI-Powered, Free & Open Source)
- **Call to Action**: "Connect Your AI Assistant to n8n"

### File Locations:
- Primary: `.github/assets/social-preview.png`
- Twitter: `.github/assets/social-preview-twitter.png`
- LinkedIn: `.github/assets/social-preview-linkedin.png`

## Usage in README.md

Add these meta tags to the top of README.md (after the title):

```html
<!-- Social Media Preview Meta Tags -->
<meta property="og:title" content="n8n Workflow Builder MCP Server - AI Assistant Integration">
<meta property="og:description" content="Connect Claude Desktop, ChatGPT, and other AI assistants to n8n for natural language workflow automation">
<meta property="og:image" content="https://raw.githubusercontent.com/makafeli/n8n-workflow-builder/main/.github/assets/social-preview.png">
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="n8n Workflow Builder MCP Server">
<meta property="twitter:description" content="AI-powered n8n workflow automation through natural language commands">
<meta property="twitter:image" content="https://raw.githubusercontent.com/makafeli/n8n-workflow-builder/main/.github/assets/social-preview.png">
```

## Testing Social Previews

### Facebook/Meta:
- Use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- Enter repository URL to test preview

### Twitter/X:
- Use [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- Test with repository URL

### LinkedIn:
- Use [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- Validate social preview appearance

### General Testing:
- [Social Share Preview](https://socialsharepreview.com/)
- [Meta Tags](https://metatags.io/)
- [Open Graph Check](https://opengraphcheck.com/)

## Best Practices

1. **Image Quality**: Use high-resolution images (minimum 1200px width)
2. **Text Readability**: Ensure text is readable at small sizes
3. **Brand Consistency**: Use consistent colors and fonts
4. **Mobile Optimization**: Test on mobile social apps
5. **Regular Updates**: Update images when major features are added
6. **A/B Testing**: Test different preview styles for engagement

## Maintenance

- Update social preview images when major releases occur
- Refresh meta descriptions to reflect new features
- Monitor social sharing analytics
- Update preview images for seasonal campaigns or major announcements
