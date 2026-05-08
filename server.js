const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const RIOT_API_KEY = process.env.RIOT_API_KEY;

// 서버 시작 시 키 확인 로그 추가
if (!RIOT_API_KEY || RIOT_API_KEY === 'your_riot_api_key_here' || RIOT_API_KEY === '') {
    console.log('--------------------------------------------------');
    console.error('❌ 경고: 라이엇 API 키가 감지되지 않았습니다!');
    console.log('1. .env 파일이 있는지 확인하세요.');
    console.log('2. RIOT_API_KEY=RGAPI-xxxx... 형식인지 확인하세요.');
    console.log('--------------------------------------------------');
} else {
    console.log('--------------------------------------------------');
    console.log('✅ 라이엇 API 키 로드 완료!');
    console.log('서버가 정상적으로 라이엇 데이터를 가져올 준비가 되었습니다.');
    console.log('--------------------------------------------------');
}

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Riot API Base URLs
const ASIA_URL = 'https://asia.api.riotgames.com';
const KR_URL = 'https://kr.api.riotgames.com';

/**
 * 1. Get PUUID by Riot ID (Name + Tag)
 */
app.get('/api/summoner/:name/:tag', async (req, res) => {
    try {
        const { name, tag } = req.params;
        const response = await axios.get(
            `${ASIA_URL}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
            { headers: { 'X-Riot-Token': RIOT_API_KEY } }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching account:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ error: '계정을 찾을 수 없습니다.' });
    }
});

/**
 * 2. Get Match History (ARAM specific)
 */
app.get('/api/matches/:puuid', async (req, res) => {
    try {
        const { puuid } = req.params;
        // queue 450 is ARAM, but ARAM Mayhem might have a different queue ID or be part of 450.
        // We'll fetch the last 20 matches.
        const response = await axios.get(
            `${ASIA_URL}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20`,
            { headers: { 'X-Riot-Token': RIOT_API_KEY } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: '전적 목록을 가져오지 못했습니다.' });
    }
});

/**
 * 3. Get Match Details
 */
app.get('/api/match-detail/:matchId', async (req, res) => {
    try {
        const { matchId } = req.params;
        const response = await axios.get(
            `${ASIA_URL}/lol/match/v5/matches/${matchId}`,
            { headers: { 'X-Riot-Token': RIOT_API_KEY } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: '경기 상세 정보를 가져오지 못했습니다.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
