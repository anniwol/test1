document.addEventListener('DOMContentLoaded', () => {
    const ballContainer = document.getElementById('ball-container');
    const generateBtn = document.getElementById('generate-btn');
    const resetBtn = document.getElementById('reset-btn');

    /**
     * 로또 번호 생성 (1~45 중 6개 랜덤 중복 없이)
     */
    function generateLottoNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            const num = Math.floor(Math.random() * 45) + 1;
            numbers.add(num);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    /**
     * 숫자에 따른 공 색상 클래스 반환
     */
    function getRangeClass(num) {
        if (num <= 10) return 'range-1'; // 1-10 노랑
        if (num <= 20) return 'range-2'; // 11-20 파랑
        if (num <= 30) return 'range-3'; // 21-30 빨강
        if (num <= 40) return 'range-4'; // 31-40 회색
        return 'range-5'; // 41-45 초록
    }

    /**
     * 공 생성 및 화면 표시
     */
    function displayNumbers() {
        // 기존 내용 삭제
        ballContainer.innerHTML = '';
        
        const numbers = generateLottoNumbers();
        
        numbers.forEach((num, index) => {
            const ball = document.createElement('div');
            ball.classList.add('ball', getRangeClass(num));
            ball.textContent = num;
            
            // 순차적 등장을 위한 딜레이 설정
            ball.style.animationDelay = `${index * 0.1}s`;
            
            ballContainer.appendChild(ball);
        });
    }

    /**
     * 초기화 함수
     */
    function reset() {
        ballContainer.innerHTML = '<div class="placeholder">생성 버튼을 눌러주세요</div>';
    }

    // 이벤트 리스너 등록
    generateBtn.addEventListener('click', displayNumbers);
    resetBtn.addEventListener('click', reset);
});
