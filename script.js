document.addEventListener('DOMContentLoaded', function() {
    // 상담 현황 슬라이더
    const surnames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];
    const statusContainer = document.querySelector('.status-items');
    
    // 상담 현황 데이터 생성
    const createConsultItems = () => {
        const items = [];
        for(let i = 0; i < 20; i++) {
            const surname = surnames[Math.floor(Math.random() * surnames.length)];
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
            
            items.push({
                name: `${surname}**`,
                date: date.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }).replace(/\. /g, '.').replace('.', '')
            });
        }
        return items;
    };

    // HTML 생성 및 삽입
    const renderConsultItems = () => {
        const items = createConsultItems();
        const html = items.map(item => `
            <div class="status-item">
                <span class="badge">상담완료</span>
                <span>${item.name} 상담이 완료되었습니다.</span>
                <span class="date">${item.date}</span>
            </div>
        `).join('');
        
        // 무한 스크롤을 위해 동일한 내용 반복
        statusContainer.innerHTML = html + html;
    };

    renderConsultItems();

    // 스크롤이 끝나면 다시 시작
    statusContainer.addEventListener('animationend', () => {
        statusContainer.style.animation = 'none';
        setTimeout(() => {
            statusContainer.style.animation = 'scrollUp 30s linear infinite';
        }, 100);
    });

    // 대출 상품 슬라이더
    const loanCards = document.querySelector('.loan-cards');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const pageCount = document.querySelector('.page-count');
    
    const cardWidth = 256.67 + 15; // 카드 너비 + gap
    const totalCards = loanCards.children.length;
    const visibleCards = 3; // 한 번에 보이는 카드 수
    let currentIndex = 0;

    // 카드 복제 및 추가
    const setupInfiniteLoop = () => {
        // 처음 3개의 카드를 복제하여 끝에 추가
        for (let i = 0; i < visibleCards; i++) {
            const clone = loanCards.children[i].cloneNode(true);
            loanCards.appendChild(clone);
        }
    };

    const updateSlider = (transition = true) => {
        loanCards.style.transition = transition ? 'transform 0.5s ease' : 'none';
        const offset = -(currentIndex * cardWidth);
        loanCards.style.transform = `translateX(${offset}px)`;
        
        // 페이지 카운터 업데이트
        const displayIndex = (currentIndex % totalCards) + 1;
        pageCount.textContent = `${displayIndex} / ${totalCards}`;
        
        // 모든 카드의 배경을 초기화
        Array.from(loanCards.children).forEach(card => {
            card.style.background = 'rgba(255, 255, 255, 0.2)';
        });

        // 현재 카드의 배경을 흰색으로 설정
        const activeCardIndex = currentIndex % totalCards;
        loanCards.children[activeCardIndex].style.background = 'white';
    };

    // 무한 루프 처리
    loanCards.addEventListener('transitionend', () => {
        if (currentIndex >= totalCards) {
            currentIndex = 0;
            updateSlider(false);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    nextBtn.addEventListener('click', () => {
        currentIndex++;
        updateSlider();
    });

    // 자동 슬라이드
    setInterval(() => {
        currentIndex++;
        updateSlider();
    }, 3000);

    // 초기 설정
    setupInfiniteLoop();
    updateSlider(false);
});
