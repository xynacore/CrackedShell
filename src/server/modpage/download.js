import axios from 'axios';
import config from '#config';
import cache from '#cache';

export default async (app) => await app.post('/mod/download/', async (req, res) => {
    let isURL;

    try {
        isURL = !!new URL(req.body.url);
    } catch {
        isURL = false;
    };

    if (!isURL) return res.send({
        success: false,
        error: `Invalid URL.`
    });

    if (config.cache.allowed.some(s => req.body.url.startsWith(s)) || config.cache.allowed.includes('*')) {
        try {
            let resp = await axios.get(req.body.url);
            cache.set(req.body.url, resp.data);

            res.send({
                success: true
            });
        } catch {
            res.send({
                success: false,
                error: `Script not found.`
            });
        };
    } else res.send({
        success: false,
        error: `Invalid origin.`
    });
});
