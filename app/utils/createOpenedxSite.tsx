export const createOpenedxSite = async ({siteName, siteDomain, userEmail}: {siteName: string, siteDomain: string, userEmail: string}) => {
    const domain = `learn.${siteDomain}.${process.env.MAIN_DOMAIN}`;
    const studioDomain = `studio.${domain}`;
    const SiteFrontendDomain = `${siteDomain}.${process.env.MAIN_DOMAIN}`;

    const user_data = `#cloud-config
write_files:
  - path: /root/wait-for-setup
    content: |
      #!/bin/bash
      while ! host ${domain}; do
        echo "Waiting for DNS propagation..."
        sleep 10
      done
      source /root/venv/bin/activate
      tutor config save \
        --set CMS_HOST="${studioDomain}" \
        --set LMS_HOST="${domain}" \
        --set ENABLE_HTTPS=true \
        --set ACTIVATE_HTTPS=true \
        --set PLATFORM_NAME="${siteName}" \
        --set SESSION_COOKIE_DOMAIN=".${SiteFrontendDomain}" \
        --set SMTP_HOST=smtp.resend.com \
        --set SMTP_PORT=587 \
        --set SMTP_USE_SSL=false \
        --set SMTP_USE_TLS=true \
        --set SMTP_USERNAME="resend" \
        --set SMTP_PASSWORD="${process.env.RESEND_API_KEY}" \
        --set DEFAULT_FROM_EMAIL="${process.env.SERVER_EMAIL}" \
        --set CONTACT_EMAIL="${process.env.SERVER_EMAIL}"
      
      tutor local launch -I
      # Generate random 16 character password with letters, numbers and symbols
      PASSWORD=$(openssl rand -base64 12)
      USERNAME=$(echo ${userEmail} | cut -d@ -f1)
      tutor local do createuser --staff --superuser $USERNAME ${userEmail} --password $PASSWORD
      tutor local do createuser --staff --superuser devops devops@cubite.io --password $PASSWORD
    permissions: '0755'
runcmd:
  - /root/wait-for-setup`;

    const serverSpecification = {
        name: siteDomain,
        firewalls: [{
            "firewall": 1793976
        }],
        image: "204826692",
        server_type: "cax31",
        datacenter: "nbg1-dc3",
        ssh_keys: ["Amir"],
        user_data: user_data
    }

    const response = await fetch(`https://api.hetzner.cloud/v1/servers`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.cubite_hetzner_api_key}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(serverSpecification),
    })
    const data = await response.json()
    console.log(data)
    let serverStatus = data.server.status
    let serverResponse;
    
    // wait until serverStatus is "running"
    while (serverStatus !== "running") {
        await new Promise(resolve => setTimeout(resolve, 1000));
        serverResponse = await fetch(`https://api.hetzner.cloud/v1/servers/${data.server.id}`, {
            headers: {
                "Authorization": `Bearer ${process.env.cubite_hetzner_api_key}`,
                "Content-Type": "application/json",
            },
        }).then(res => res.json())
        serverStatus = serverResponse.server.status
    }
    const serverIp = serverResponse.server.public_net.ipv4.ip
    const serverId = serverResponse.server.id

    const zoneId = process.env.MAIN_DOMAIN === "cubite.dev" ? process.env.CLOUDFLARE_CUBITE_DEV_ZONE_ID : process.env.CLOUDFLARE_CUBITE_IO_ZONE_ID

    // Create DNS records
    if (serverIp) {
        // Create A record
        const aRecordResponse = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'A',
                name: `learn.${siteDomain}.${process.env.MAIN_DOMAIN}`,
                content: serverIp,
                ttl: 1,
                proxied: false
            })
        });

        const aRecordData = await aRecordResponse.json();
        
        if (!aRecordData.success) {
            return {
                status: 500,
                message: "Failed to create A record",
                data: null
            }
        }

        // Create CNAME record
        const cnameRecordResponse = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'CNAME',
                name: `*.learn.${siteDomain}.${process.env.MAIN_DOMAIN}`,
                content: `learn.${siteDomain}.${process.env.MAIN_DOMAIN}`,
                ttl: 1,
                proxied: false
            })
        });

        const cnameRecordData = await cnameRecordResponse.json();

        if (!cnameRecordData.success) {
            return {
                status: 500,
                message: "Failed to create CNAME record",
                data: null
            }
        }
    }

    if (response.status === 201 && serverStatus === "running") {
        return {
            status: 201,
            message: "Openedx site created successfully",
            data: {
                serverId: serverId.toString(),
                serverIp: serverIp.toString()
            }
        }
    } else {
        return {
            status: 500,
            message: "Failed to create openedx site",
            data: null
        }
    }
}