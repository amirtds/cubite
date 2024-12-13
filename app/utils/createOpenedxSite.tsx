export const createOpenedxSite = async () => {
    const serverSpecification = {
        name: "openedx-site",
        image: "ubuntu-24.04",
        server_type: "cx42",
        datacenter: "nbg1-dc3",
        ssh_keys: ["Amir"],
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
    if (response.status === 201) {
        return {
            status: 201,
            message: "Openedx site created successfully",
            data: data
        }
    } else {
        return {
            status: 500,
            message: "Failed to create openedx site",
            data: null
        }
    }
}