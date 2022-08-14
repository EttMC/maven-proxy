const express = require('express');
const app = express();
const axios = require('axios');

app.use(express.static('static'));

app.get('*', async (req, res) => {
    let url;
    let directory;

    async function directorySlashRemoval() {
        if (directory.startsWith('/')) {
            directory = directory.substring(1)
            directorySlashRemoval()
        }
    }
    
    // Fabric maven proxy
    if (req.url.startsWith('/fabric')) {
        if (!(req.url[9])) directory = ``
        else directory = req.url.substring(8)
        directorySlashRemoval()

        // CombatReforged maven
        if (directory.startsWith('com/combatreforged')) url = `https://nexus.rizecookey.net/repository/combatreforged/${directory}`
        else if (directory.startsWith('net/fabricmc/intermediary/1.16_combat-6')) url = `https://nexus.rizecookey.net/repository/combatreforged/${directory}`
        else if (directory.startsWith('net/fabricmc/yarn/1.16_combat-6')) url = `https://nexus.rizecookey.net/repository/combatreforged/${directory}`
        
        // Fabric maven
        else url = `https://maven.fabricmc.net/${directory}`
    
        axios.get(url, {"headers": {
            "User-Agent": "EttMC-Proxy/1.0 (github.com/EttMC/maven-proxy)"
        }})
        .then((response) => {
            res.status(response.status).send(response.data);
        })
        .catch((error) => {
            res.status(error.response.status).send(error.response.data);
        })
    }

    // Quilt maven proxy
    else if (req.url.startsWith('/quilt')) {
        if (!(req.url[8])) directory = ``
        else directory = req.url.substring(7)
        directorySlashRemoval()

        url = `https://maven.quiltmc.org/repository/${directory}`

        axios.get(url, {"headers": {
            "User-Agent": "EttMC-Proxy/1.0 (github.com/EttMC/maven-proxy)"
        }})
        .then((response) => {
            res.status(response.status).send(response.data);
        })
        .catch((error) => {
            res.status(error.response.status).send(error.response.data);
        })
    }

    else res.redirect('https://github.com/EttMC/maven-proxy')
});

app.listen('80')