export const createOpenedxSite = async ({siteName, siteDomain}: {siteName: string, siteDomain: string}) => {

    const serverSpecification = {
        name: siteDomain,
        firewalls: [{
            "firewall": 1793976
        }],
        image: "204826692",
        server_type: "cax31",
        datacenter: "nbg1-dc3",
        ssh_keys: ["Amir"]
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