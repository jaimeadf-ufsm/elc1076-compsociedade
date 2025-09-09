# Gemini Local HTTPS Setup Script
# This script automates the setup process for running your Gemini clone on https://gemini.google.com

param(
    [switch]$SkipCertificateInstall,
    [switch]$SkipHostsFile,
    [switch]$GenerateCertificateOnly
)

Write-Host "🚀 Setting up Gemini Local HTTPS Environment" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Check if running as administrator
$currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
$isAdmin = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ This script requires administrator privileges!" -ForegroundColor Red
    Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
    exit 1
}

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check dependencies
Write-Host "🔍 Checking dependencies..." -ForegroundColor Blue

if (-not (Test-Command "docker")) {
    Write-Host "❌ Docker is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "Please install Docker Desktop: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Command "docker-compose")) {
    Write-Host "❌ Docker Compose is not installed or not in PATH!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies check passed!" -ForegroundColor Green

# Navigate to the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Step 1: Generate SSL Certificate
Write-Host "🔐 Generating SSL certificate..." -ForegroundColor Blue

if (-not (Test-Path "nginx\ssl\gemini.google.com.crt") -or -not (Test-Path "nginx\ssl\gemini.google.com.key")) {
    if (Test-Command "openssl") {
        Write-Host "Using OpenSSL to generate certificate..." -ForegroundColor Yellow
        & openssl req -x509 -newkey rsa:4096 -keyout "nginx\ssl\gemini.google.com.key" -out "nginx\ssl\gemini.google.com.crt" -days 365 -nodes -config "nginx\ssl\cert.conf"
    } else {
        Write-Host "OpenSSL not found, using PowerShell to generate certificate..." -ForegroundColor Yellow
        $cert = New-SelfSignedCertificate -DnsName "gemini.google.com", "*.gemini.google.com" -CertStoreLocation "cert:\LocalMachine\My" -NotAfter (Get-Date).AddYears(1)
        $pwd = ConvertTo-SecureString -String "temp123" -Force -AsPlainText
        
        # Export certificate to files
        $certPath = "cert:\LocalMachine\My\$($cert.Thumbprint)"
        Export-Certificate -Cert $certPath -FilePath "nginx\ssl\gemini.google.com.crt" -Type CERT
        
        # For the private key, we need to use a different approach
        $tempPfx = "nginx\ssl\temp.pfx"
        Export-PfxCertificate -Cert $certPath -FilePath $tempPfx -Password $pwd -Force | Out-Null
        
        # Convert to PEM format using .NET classes
        $pfx = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($tempPfx, "temp123", [System.Security.Cryptography.X509Certificates.X509KeyStorageFlags]::Exportable)
        $privateKeyBytes = $pfx.PrivateKey.ExportPkcs8PrivateKey()
        $privateKeyPem = "-----BEGIN PRIVATE KEY-----`n" + [System.Convert]::ToBase64String($privateKeyBytes, [System.Base64FormattingOptions]::InsertLineBreaks) + "`n-----END PRIVATE KEY-----"
        $privateKeyPem | Out-File -FilePath "nginx\ssl\gemini.google.com.key" -Encoding ASCII
        
        # Clean up temporary file
        Remove-Item $tempPfx -Force
        
        # Clean up certificate from store
        Remove-Item $certPath -Force
    }
    Write-Host "✅ SSL certificate generated!" -ForegroundColor Green
} else {
    Write-Host "✅ SSL certificate already exists!" -ForegroundColor Green
}

if ($GenerateCertificateOnly) {
    Write-Host "🎉 Certificate generation complete!" -ForegroundColor Green
    exit 0
}

# Step 2: Update hosts file
if (-not $SkipHostsFile) {
    Write-Host "📝 Updating hosts file..." -ForegroundColor Blue
    $hostsPath = "C:\Windows\System32\drivers\etc\hosts"
    $hostsContent = Get-Content $hostsPath
    $geminiEntry = "127.0.0.1       gemini.google.com"
    
    if ($hostsContent -notcontains $geminiEntry) {
        Add-Content -Path $hostsPath -Value $geminiEntry
        Write-Host "✅ Hosts file updated!" -ForegroundColor Green
    } else {
        Write-Host "✅ Hosts file already configured!" -ForegroundColor Green
    }
}

# Step 3: Install certificate as trusted
if (-not $SkipCertificateInstall) {
    Write-Host "🔒 Installing certificate as trusted..." -ForegroundColor Blue
    try {
        Import-Certificate -FilePath "nginx\ssl\gemini.google.com.crt" -CertStoreLocation Cert:\LocalMachine\Root -ErrorAction Stop | Out-Null
        Write-Host "✅ Certificate installed as trusted!" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Certificate installation failed: $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host "You may need to install it manually using certmgr.msc" -ForegroundColor Yellow
    }
}

# Step 4: Build and start Docker containers
Write-Host "🐳 Building and starting Docker containers..." -ForegroundColor Blue

try {
    & docker-compose down --remove-orphans 2>$null
    & docker-compose up -d --build
    
    Write-Host "✅ Docker containers started!" -ForegroundColor Green
    
    # Wait a moment for containers to fully start
    Start-Sleep 5
    
    # Check container status
    Write-Host "📊 Container status:" -ForegroundColor Blue
    & docker-compose ps
    
} catch {
    Write-Host "❌ Failed to start Docker containers: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 5: Final verification
Write-Host "🧪 Running final verification..." -ForegroundColor Blue

# Test DNS resolution
try {
    $dnsResult = Resolve-DnsName "gemini.google.com" -ErrorAction Stop
    if ($dnsResult[0].IPAddress -eq "127.0.0.1") {
        Write-Host "✅ DNS resolution working correctly!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  DNS resolution returned unexpected IP: $($dnsResult[0].IPAddress)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  DNS resolution test failed" -ForegroundColor Yellow
}

# Test HTTPS connection
try {
    $response = Invoke-WebRequest -Uri "https://gemini.google.com" -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ HTTPS connection successful!" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  HTTPS connection test failed: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "The application might still be starting up. Please wait a moment and try accessing https://gemini.google.com manually." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host "Your Gemini clone is now available at:" -ForegroundColor White
Write-Host "🌐 https://gemini.google.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Blue
Write-Host "  1. Open your web browser" -ForegroundColor White
Write-Host "  2. Navigate to https://gemini.google.com" -ForegroundColor White
Write-Host "  3. Enjoy your local Gemini clone!" -ForegroundColor White
Write-Host ""
Write-Host "🛠️  Useful commands:" -ForegroundColor Blue
Write-Host "  • View logs: docker-compose logs -f" -ForegroundColor White
Write-Host "  • Restart:   docker-compose restart" -ForegroundColor White
Write-Host "  • Stop:      docker-compose down" -ForegroundColor White
Write-Host ""

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Some issues were encountered during setup." -ForegroundColor Yellow
    Write-Host "Please check the output above and refer to SETUP_TUTORIAL.md for troubleshooting." -ForegroundColor Yellow
}
