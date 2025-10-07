# PowerShell script to add FOUC fix to all HTML pages

$htmlFiles = @(
    "about.html",
    "contact.html",
    "events.html",
    "gallery.html",
    "team.html",
    "vedathon.html",
    "code-veda.html"
)

$criticalCSS = @"
    <!-- Critical Inline CSS to prevent FOUC -->
    <style>
        /* Prevent flash of unstyled content */
        html {
            background-color: #000000;
        }
        body {
            margin: 0;
            padding: 0;
            background-color: #000000;
            color: #ffffff;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        body.loaded {
            opacity: 1;
        }
        /* Loading overlay */
        .page-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000000;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        .page-loader.hidden {
            opacity: 0;
            visibility: hidden;
        }
        .loader-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(160, 255, 143, 0.1);
            border-top-color: #A0FF8F;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
    
"@

$pageLoaderHTML = @"
    <!-- Page Loader -->
    <div class="page-loader" id="page-loader">
        <div class="loader-spinner"></div>
    </div>
    
"@

$pageLoadScript = @"
    <!-- Page Load Handler - Execute First -->
    <script>
        // Hide loader and show content when page is ready
        function initPageDisplay() {
            const loader = document.getElementById('page-loader');
            const body = document.body;
            
            // Wait for critical resources
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', hideLoader);
            } else {
                hideLoader();
            }
            
            function hideLoader() {
                // Small delay to ensure CSS is applied
                setTimeout(() => {
                    body.classList.add('loaded');
                    if (loader) {
                        loader.classList.add('hidden');
                        // Remove from DOM after transition
                        setTimeout(() => loader.remove(), 300);
                    }
                }, 100);
            }
        }
        
        initPageDisplay();
    </script>
    
"@

Write-Host "Starting FOUC fix application..." -ForegroundColor Green

foreach ($file in $htmlFiles) {
    if (Test-Path $file) {
        Write-Host "Processing $file..." -ForegroundColor Yellow
        
        $content = Get-Content $file -Raw
        
        # Add critical CSS before </head> if not already present
        if ($content -notmatch "Critical Inline CSS to prevent FOUC") {
            $content = $content -replace '(\s*</head>)', "$criticalCSS`$1"
            Write-Host "  - Added critical CSS" -ForegroundColor Cyan
        }
        
        # Add page loader after <body> if not already present
        if ($content -notmatch 'id="page-loader"') {
            $content = $content -replace '(<body[^>]*>)', "`$1`n$pageLoaderHTML"
            Write-Host "  - Added page loader" -ForegroundColor Cyan
        }
        
        # Add page load script before other scripts if not already present
        if ($content -notmatch "initPageDisplay") {
            $content = $content -replace '(\s*<!--\s*Scripts\s*-->)', "$pageLoadScript`$1"
            Write-Host "  - Added page load script" -ForegroundColor Cyan
        }
        
        # Save the modified content
        $content | Out-File -FilePath $file -Encoding UTF8 -NoNewline
        Write-Host "  ✓ $file updated successfully" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file not found" -ForegroundColor Red
    }
}

Write-Host "`nFOUC fix application completed!" -ForegroundColor Green
Write-Host "All pages now have smooth loading transitions without white flash." -ForegroundColor Cyan
