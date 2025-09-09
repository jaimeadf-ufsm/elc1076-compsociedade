# Local HTTPS Setup Tutorial for gemini.google.com

This tutorial will guide you through setting up a local development environment that serves your Gemini clone on `https://gemini.google.com` with proper SSL certificates.

## Prerequisites

- Docker and Docker Compose installed
- Administrative privileges on your Windows machine
- PowerShell or Command Prompt

## Step 1: Generate SSL Certificates

First, create a self-signed SSL certificate for `gemini.google.com`:

### Option A: Using OpenSSL (Recommended)

1. Install OpenSSL for Windows from [https://slproweb.com/products/Win32OpenSSL.html](https://slproweb.com/products/Win32OpenSSL.html)

2. Create the certificate configuration file:

Create a file named `cert.conf` in the `nginx/ssl` directory with the following content:

```ini
[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no

[req_distinguished_name]
C = US
ST = CA
L = Mountain View
O = Google LLC
OU = Gemini Development
CN = gemini.google.com

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = gemini.google.com
DNS.2 = *.gemini.google.com
```

3. Generate the certificate and key:

```powershell
# Generate private key and certificate
openssl req -x509 -newkey rsa:4096 -keyout nginx/ssl/gemini.google.com.key -out nginx/ssl/gemini.google.com.crt -days 365 -nodes -config nginx/ssl/cert.conf
```

### Option B: Using PowerShell (Alternative)

```powershell
# Create the certificate using PowerShell
$cert = New-SelfSignedCertificate -DnsName "gemini.google.com", "*.gemini.google.com" -CertStoreLocation "cert:\LocalMachine\My" -NotAfter (Get-Date).AddYears(1)

# Export the certificate
$pwd = ConvertTo-SecureString -String "password123" -Force -AsPlainText
Export-PfxCertificate -Cert $cear
rt -FilePath "nginx\ssl\gemini.google.com.pfx" -Password $pwd

# Convert PFX to PEM format (requires OpenSSL)
openssl pkcs12 -in nginx\ssl\gemini.google.com.pfx -out nginx\ssl\gemini.google.com.crt -clcerts -nokeys -passin pass:password123
openssl pkcs12 -in nginx\ssl\gemini.google.com.pfx -out nginx\ssl\gemini.google.com.key -nocerts -nodes -passin pass:password123
```

## Step 2: Modify Windows Hosts File

Edit your Windows hosts file to redirect `gemini.google.com` to localhost:

1. **Open PowerShell as Administrator**

2. **Edit the hosts file:**

```powershell
# Open hosts file in notepad
notepad C:\Windows\System32\drivers\etc\hosts
```

3. **Add the following line at the end of the file:**

```
127.0.0.1       gemini.google.com
```

4. **Save the file**

## Step 3: Install the SSL Certificate as Trusted

To avoid browser warnings, install your self-signed certificate as a trusted root certificate:

### Method 1: Using Certificate Manager (certmgr.msc)

1. Press `Win + R`, type `certmgr.msc`, and press Enter
2. Navigate to **Trusted Root Certification Authorities** → **Certificates**
3. Right-click in the certificates area and select **All Tasks** → **Import...**
4. Browse to your `gemini.google.com.crt` file and import it
5. Restart your browser

### Method 2: Using PowerShell (Run as Administrator)

```powershell
# Import certificate to trusted root store
Import-Certificate -FilePath "nginx\ssl\gemini.google.com.crt" -CertStoreLocation Cert:\LocalMachine\Root
```

## Step 4: Build and Run the Application

1. **Build and start the containers:**

```powershell
# Build and start the application
docker-compose up -d --build
```

2. **Verify the containers are running:**

```powershell
docker-compose ps
```

You should see both `gemini-app` and `gemini-nginx` containers running.

## Step 5: Access Your Application

1. Open your web browser
2. Navigate to `https://gemini.google.com`
3. You should see your Gemini clone running with a valid SSL certificate!

## Troubleshooting

### Browser Still Shows Security Warning

- Clear your browser cache and cookies
- Restart your browser completely
- Verify the certificate was properly imported into the Trusted Root Certification Authorities store

### Cannot Access the Site

1. **Check if containers are running:**
   ```powershell
   docker-compose ps
   ```

2. **Check container logs:**
   ```powershell
   docker-compose logs gemini-app
   docker-compose logs gemini-nginx
   ```

3. **Verify hosts file:**
   ```powershell
   Get-Content C:\Windows\System32\drivers\etc\hosts | Select-String "gemini.google.com"
   ```

4. **Test DNS resolution:**
   ```powershell
   nslookup gemini.google.com
   ```

### Port Conflicts

If you get port conflicts (80 or 443 already in use):

1. **Find what's using the ports:**
   ```powershell
   netstat -ano | findstr :443
   netstat -ano | findstr :80
   ```

2. **Stop the conflicting services or change ports in docker-compose.yaml**

## Commands Reference

### Useful Docker Commands

```powershell
# Start the application
docker-compose up -d

# Stop the application
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# View logs
docker-compose logs -f

# Check container status
docker-compose ps
```

### SSL Certificate Renewal

When your certificate expires (after 1 year), regenerate it:

```powershell
# Remove old certificate
Remove-Item nginx\ssl\gemini.google.com.*

# Generate new certificate (use the same command from Step 1)
openssl req -x509 -newkey rsa:4096 -keyout nginx/ssl/gemini.google.com.key -out nginx/ssl/gemini.google.com.crt -days 365 -nodes -config nginx/ssl/cert.conf

# Restart containers
docker-compose restart
```

## Security Notes

- This setup is for **development purposes only**
- Never use self-signed certificates in production
- The generated certificates are not secure for real-world use
- Consider using tools like mkcert for easier local SSL certificate management

## Additional Configuration

### Environment Variables

You can customize the application by setting environment variables in `docker-compose.yaml`:

```yaml
environment:
  - NODE_ENV=production
  - CUSTOM_VAR=value
```

### Custom Nginx Configuration

Modify `nginx/nginx.conf` to customize the web server behavior, add more security headers, or configure caching rules.

## Cleanup

To completely remove the setup:

1. **Stop and remove containers:**
   ```powershell
   docker-compose down --volumes --remove-orphans
   ```

2. **Remove the hosts file entry:**
   - Edit `C:\Windows\System32\drivers\etc\hosts`
   - Remove the line: `127.0.0.1       gemini.google.com`

3. **Remove the trusted certificate:**
   - Open `certmgr.msc`
   - Navigate to Trusted Root Certification Authorities → Certificates
   - Find and delete the gemini.google.com certificate
