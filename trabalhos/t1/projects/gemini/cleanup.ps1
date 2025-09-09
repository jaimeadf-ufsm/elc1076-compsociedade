# Cleanup Script for Gemini Local HTTPS Setup
# This script removes all traces of the local setup

param(
    [switch]$Force,
    [switch]$KeepImages
)

Write-Host "🧹 Gemini Local HTTPS Cleanup" -ForegroundColor Yellow
Write-Host "==============================" -ForegroundColor Yellow

# Check if running as administrator
$currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
$isAdmin = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ This script requires administrator privileges!" -ForegroundColor Red
    Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
    exit 1
}

# Navigate to the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

if (-not $Force) {
    $confirm = Read-Host "This will remove all Docker containers, certificates, and hosts file entries. Continue? (y/N)"
    if ($confirm -ne "y" -and $confirm -ne "Y") {
        Write-Host "❌ Cleanup cancelled." -ForegroundColor Red
        exit 0
    }
}

# Step 1: Stop and remove Docker containers
Write-Host "🐳 Stopping Docker containers..." -ForegroundColor Blue
try {
    & docker-compose down --volumes --remove-orphans
    Write-Host "✅ Docker containers stopped and removed!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Failed to stop Docker containers (they might not be running)" -ForegroundColor Yellow
}

# Step 2: Remove Docker images (optional)
if (-not $KeepImages) {
    Write-Host "🗑️  Removing Docker images..." -ForegroundColor Blue
    try {
        $images = @(
            "gemini-gemini-app",
            "gemini_gemini-app"
        )
        
        foreach ($image in $images) {
            try {
                & docker rmi $image -f 2>$null
            } catch {
                # Ignore errors - image might not exist
            }
        }
        Write-Host "✅ Docker images cleaned up!" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Some Docker images could not be removed" -ForegroundColor Yellow
    }
}

# Step 3: Remove trusted certificate
Write-Host "🔒 Removing trusted certificate..." -ForegroundColor Blue
try {
    $certs = Get-ChildItem -Path Cert:\LocalMachine\Root | Where-Object { $_.Subject -like "*gemini.google.com*" }
    foreach ($cert in $certs) {
        Remove-Item -Path "Cert:\LocalMachine\Root\$($cert.Thumbprint)" -Force
    }
    Write-Host "✅ Trusted certificate removed!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Failed to remove certificate: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Step 4: Remove hosts file entry
Write-Host "📝 Cleaning hosts file..." -ForegroundColor Blue
try {
    $hostsPath = "C:\Windows\System32\drivers\etc\hosts"
    $hostsContent = Get-Content $hostsPath
    $cleanedContent = $hostsContent | Where-Object { $_ -notmatch "gemini\.google\.com" }
    
    if ($hostsContent.Count -ne $cleanedContent.Count) {
        $cleanedContent | Out-File -FilePath $hostsPath -Encoding ASCII
        Write-Host "✅ Hosts file cleaned!" -ForegroundColor Green
    } else {
        Write-Host "✅ No hosts file entries to clean!" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Failed to clean hosts file: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Step 5: Remove SSL certificate files (optional)
Write-Host "🔐 Removing SSL certificate files..." -ForegroundColor Blue
try {
    if (Test-Path "nginx\ssl\gemini.google.com.crt") {
        Remove-Item "nginx\ssl\gemini.google.com.crt" -Force
    }
    if (Test-Path "nginx\ssl\gemini.google.com.key") {
        Remove-Item "nginx\ssl\gemini.google.com.key" -Force
    }
    if (Test-Path "nginx\ssl\cert.conf") {
        # Keep cert.conf as it's part of the project template
        Write-Host "Keeping cert.conf template file..." -ForegroundColor Cyan
    }
    Write-Host "✅ SSL certificate files removed!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Failed to remove some SSL files: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Step 6: Flush DNS cache
Write-Host "🔄 Flushing DNS cache..." -ForegroundColor Blue
try {
    & ipconfig /flushdns | Out-Null
    Write-Host "✅ DNS cache flushed!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Failed to flush DNS cache" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Cleanup complete!" -ForegroundColor Green
Write-Host "=====================" -ForegroundColor Green
Write-Host ""
Write-Host "✅ What was cleaned up:" -ForegroundColor Blue
Write-Host "  • Docker containers and volumes" -ForegroundColor White
if (-not $KeepImages) {
    Write-Host "  • Docker images" -ForegroundColor White
}
Write-Host "  • Trusted SSL certificate" -ForegroundColor White
Write-Host "  • Hosts file entries" -ForegroundColor White
Write-Host "  • SSL certificate files" -ForegroundColor White
Write-Host "  • DNS cache" -ForegroundColor White
Write-Host ""
Write-Host "📝 Note: To set up again, run: .\setup.ps1" -ForegroundColor Cyan
