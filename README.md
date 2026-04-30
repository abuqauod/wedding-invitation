How to configure this solution on a Self-host server (VPS) on your own:
Best fit: a small Linux VPS like Hetzner (€4/mo), DigitalOcean ($6/mo), Contabo, or AWS Lightsail. The app needs Node.js + Postgres.

Step 1 — Get a server
Buy a VPS with Ubuntu 22.04 or 24.04, at least 1 GB RAM.
You'll get an IP like xx.xx.xx.xx and SSH access.
Step 2 — Buy a domain (optional but recommended)
Any registrar (Namecheap, GoDaddy, Cloudflare).
Point an A record like wedding.yourdomain.com → your server IP.
Step 3 — Install the basics on the server
SSH into the server, then:

# Node.js 20 + pnpm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs postgresql nginx git
sudo npm install -g pnpm pm2
# Start Postgres
sudo systemctl enable --now postgresql

Step 4 — Create the database
sudo -u postgres psql
CREATE DATABASE wedding;
CREATE USER weddinguser WITH PASSWORD 'pick-a-strong-password';
GRANT ALL PRIVILEGES ON DATABASE wedding TO weddinguser;
\q

Step 5 — Get the code onto the server
Easiest is GitHub:

check your access on the code here on github.
On the server:
cd /var/www
sudo git clone https://github.com/yourname/your-repo.git wedding
cd wedding
pnpm install

Step 6 — Set the secrets
Create /var/www/wedding/.env:

DATABASE_URL=postgresql://weddinguser:pick-a-strong-password@localhost:5432/wedding
SESSION_SECRET=any-long-random-string
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxx
TWILIO_WHATSAPP_FROM=+14155238886
PORT=8080
NODE_ENV=production

Step 7 — Build and migrate
pnpm --filter @workspace/api-server build
pnpm --filter @workspace/wedding build
pnpm --filter @workspace/db push   # creates the guests table

Step 8 — Run the apps with PM2 (auto-restart on reboot)
pm2 start "pnpm --filter @workspace/api-server start" --name api
pm2 start "pnpm --filter @workspace/wedding preview -- --port 5173" --name web
pm2 save
pm2 startup   # follow the printed command

Step 9 — Put nginx in front (HTTPS + nice URL)
Create /etc/nginx/sites-available/wedding:

server {
    server_name wedding.yourdomain.com;
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
    }
    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
    }
    listen 80;
}

Then:

sudo ln -s /etc/nginx/sites-available/wedding /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
# Free HTTPS certificate
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d wedding.yourdomain.com

Step 10 — Test
Open https://wedding.yourdomain.com → RSVP form should load.
Submit a test RSVP → check WhatsApp arrives.
Check pm2 logs if anything misbehaves.
Important things to know before you switch hosts
Twilio sandbox limitation — the sandbox sender (+14155238886) only delivers to numbers that have first sent the join code to it. For real guests you'll need to apply for a Twilio WhatsApp Business sender (takes a few days).
Backups — set up a daily Postgres dump (pg_dump) so guest data is safe.
The QR images are stored on disk in qr-codes/. They'll be regenerated on demand, but back this folder up too if you want history.
