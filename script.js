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

    // 카드 복제 및 추가 함수 수정
    const setupInfiniteLoop = () => {
        const originalCards = Array.from(loanCards.children);
        
        // 원본 카드들을 복제하여 뒤에 추가
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            loanCards.appendChild(clone);
        });
    };

    const updateSlider = () => {
        const isMobile = window.innerWidth <= 480;
        const isTablet = window.innerWidth <= 768 && window.innerWidth > 480;
        
        const cardWidth = isMobile ? 
            loanCards.children[0].offsetWidth : 
            isTablet ? 
                loanCards.children[0].offsetWidth * 2 + 10 : 
                271.67;
        
        const offset = -(currentIndex * cardWidth);
        loanCards.style.transform = `translateX(${offset}px)`;
        
        // 페이지 카운트는 원본 카드 개수 기준으로 표시
        const displayIndex = (currentIndex % totalCards) + 1;
        pageCount.textContent = `${displayIndex} / ${totalCards}`;
        
        // 배경색 업데이트 (원본과 복제본 모두)
        Array.from(loanCards.children).forEach(card => {
            card.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        
        // 현재 보이는 카드들의 배경색 변경
        const activeIndex = currentIndex % totalCards;
        loanCards.children[activeIndex].style.background = 'white';
        loanCards.children[activeIndex + totalCards].style.background = 'white';
    };

    // 무한 루프 처리
    loanCards.addEventListener('transitionend', () => {
        // 복제된 카드들의 중간 지점을 넘어가면
        if (currentIndex >= totalCards) {
            loanCards.style.transition = 'none';
            currentIndex = currentIndex % totalCards;
            updateSlider();
            setTimeout(() => {
                loanCards.style.transition = 'transform 0.3s ease';
            }, 50);
        }
    });

    prevBtn.addEventListener('click', () => {
        currentIndex--;
        updateSlider();
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
    updateSlider();

    // 기존 슬라이더 코드에 추가
    const updateSliderForMobile = () => {
        const isMobile = window.innerWidth <= 768;
        const cardWidth = isMobile ? 
            document.querySelector('.loan-card').offsetWidth + 15 : // 모바일에서는 카드 1개 너비 + gap
            271.67; // 데스크톱에서는 기존 값 유지

        const updateSlider = () => {
            const offset = -(currentIndex * cardWidth);
            loanCards.style.transform = `translateX(${offset}px)`;
            pageCount.textContent = `${currentIndex + 1} / ${totalCards}`;
            
            Array.from(loanCards.children).forEach(card => {
                card.style.background = 'rgba(255, 255, 255, 0.2)';
            });

            loanCards.children[currentIndex].style.background = 'white';
        };

        return updateSlider;
    };

    // 윈도우 리사이즈 이벤트 처리
    window.addEventListener('resize', () => {
        updateSliderForMobile()();
    });

    // 초기 실행
    updateSliderForMobile()();
});
