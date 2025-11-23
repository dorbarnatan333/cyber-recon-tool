# Start Cyber Recon Tool Development Server
Write-Host "Starting Cyber Recon Tool Development Server..." -ForegroundColor Cyan
Write-Host ""

# Set Node.js path
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH

# Navigate to script directory
Set-Location $PSScriptRoot

# Start dev server
Write-Host "Running: npm run dev" -ForegroundColor Yellow
Write-Host ""

& npm run dev

# Keep window open if error occurs
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Press any key to exit..." -ForegroundColor Red
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
