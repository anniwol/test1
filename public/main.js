import TFT_DATA from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    const championGrid = document.getElementById('champion-grid');
    const selectedUnitsEl = document.getElementById('selected-units');
    const selectedCountEl = document.getElementById('selected-count');
    const synergyListEl = document.getElementById('active-synergies');
    const deckResultsEl = document.getElementById('deck-results');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let selectedUnits = []; // 챔피언 ID 목록

    // 1. 초기 UI 렌더링
    renderChampionGrid('all');
    renderSelectedSlots();

    // 2. 챔피언 그리드 렌더링 함수
    function renderChampionGrid(costFilter) {
        championGrid.innerHTML = '';
        const filteredChamps = costFilter === 'all' 
            ? TFT_DATA.champions 
            : TFT_DATA.champions.filter(c => c.cost == costFilter);

        filteredChamps.forEach(champ => {
            const isSelected = selectedUnits.includes(champ.id);
            const item = document.createElement('div');
            item.className = `champ-item ${isSelected ? 'selected' : ''}`;
            item.innerHTML = `
                <img src="${champ.img}" alt="${champ.name}" class="cost-${champ.cost}">
                <span class="champ-name">${champ.name}</span>
            `;
            item.onclick = () => toggleChampion(champ.id);
            championGrid.appendChild(item);
        });
    }

    // 3. 선택된 기물 슬롯 렌더링
    function renderSelectedSlots() {
        selectedUnitsEl.innerHTML = '';
        for (let i = 0; i < 12; i++) {
            const slot = document.createElement('div');
            slot.className = 'selected-slot';
            if (selectedUnits[i]) {
                const champ = TFT_DATA.champions.find(c => c.id === selectedUnits[i]);
                slot.innerHTML = `<img src="${champ.img}" alt="${champ.name}" title="${champ.name}">`;
                slot.onclick = () => toggleChampion(champ.id);
            }
            selectedUnitsEl.appendChild(slot);
        }
        selectedCountEl.textContent = selectedUnits.length;
    }

    // 4. 챔피언 선택 토글 로직
    function toggleChampion(champId) {
        const index = selectedUnits.indexOf(champId);
        if (index > -1) {
            selectedUnits.splice(index, 1);
        } else {
            if (selectedUnits.length >= 12) {
                alert('최대 12개의 기물만 선택할 수 있습니다.');
                return;
            }
            selectedUnits.push(champId);
        }
        
        updateUI();
    }

    // 5. 전체 UI 업데이트 (시너지, 덱 추천 등)
    function updateUI() {
        renderChampionGrid(document.querySelector('.filter-btn.active').dataset.cost);
        renderSelectedSlots();
        updateSynergies();
        updateDeckRecommendations();
    }

    // 6. 실시간 시너지 계산 및 시각화
    function updateSynergies() {
        synergyListEl.innerHTML = '';
        if (selectedUnits.length === 0) {
            synergyListEl.innerHTML = '<p class="empty-msg">기물을 추가하면 시너지가 표시됩니다.</p>';
            return;
        }

        const activeCounts = {};
        selectedUnits.forEach(id => {
            const champ = TFT_DATA.champions.find(c => c.id === id);
            champ.traits.forEach(trait => {
                activeCounts[trait] = (activeCounts[trait] || 0) + 1;
            });
        });

        // 시너지 정렬 및 렌더링
        Object.entries(activeCounts)
            .sort((a, b) => b[1] - a[1])
            .forEach(([trait, count]) => {
                const traitData = TFT_DATA.traits[trait];
                const isActive = traitData.levels.some(level => count >= level);
                
                const item = document.createElement('div');
                item.className = `synergy-item ${isActive ? 'active' : ''}`;
                item.innerHTML = `
                    <div class="synergy-count">${count}</div>
                    <div class="synergy-info">
                        <strong>${trait}</strong>
                        <div style="font-size: 0.7rem; opacity: 0.7;">${traitData.levels.join(' / ')}</div>
                    </div>
                `;
                synergyListEl.appendChild(item);
            });
    }

    // 7. 교집합 덱 추천 로직 (Intersection Search)
    function updateDeckRecommendations() {
        deckResultsEl.innerHTML = '';
        if (selectedUnits.length === 0) {
            deckResultsEl.innerHTML = '<p class="empty-msg">기물을 선택하면 교집합 덱이 추천됩니다.</p>';
            return;
        }

        // 선택된 모든 기물이 포함된 덱 필터링 (Intersection)
        const recommended = TFT_DATA.decks.filter(deck => 
            selectedUnits.every(selectedId => deck.units.includes(selectedId))
        );

        if (recommended.length === 0) {
            deckResultsEl.innerHTML = '<p class="empty-msg">선택한 모든 기물이 포함된 추천 덱이 없습니다.</p>';
            return;
        }

        recommended.slice(0, 10).forEach(deck => {
            const card = document.createElement('div');
            card.className = 'deck-card';
            
            const unitsHtml = deck.units.map(uId => {
                const champ = TFT_DATA.champions.find(c => c.id === uId);
                return `<img src="${champ.img}" title="${champ.name}">`;
            }).join('');

            card.innerHTML = `
                <div class="deck-header">
                    <h3>${deck.name}</h3>
                    <span class="tier-badge">${deck.tier} Tier</span>
                </div>
                <div class="deck-units">${unitsHtml}</div>
                <p style="font-size: 0.9rem; color: var(--text-secondary);">${deck.description}</p>
            `;
            deckResultsEl.appendChild(card);
        });
    }

    // 8. 코스트 필터링 이벤트
    filterBtns.forEach(btn => {
        btn.onclick = () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderChampionGrid(btn.dataset.cost);
        };
    });
});
