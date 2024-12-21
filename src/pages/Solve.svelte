<script>
    import { push } from "svelte-spa-router";
    import { problemCnt, solveProblemCnt, correctRate, answer } from "../lib/store";
    import { onMount } from "svelte";

    let problem = [];
    $: isCorrect = false;
    $: isIncorrect = false;
    $: isEnd = false;
    $: isNormal = true;
    $: curProblemNum = 0;
    $: imagePath = '';

    let gojoDamageClass = '';
    let sukunaDamageClass = ''; 
    

    $: gojoImagePath = Sukuna_Hp <= 40 ? "images/Gojo/Gojo-3.png" 
                        : Sukuna_Hp <= 80 ? "images/Gojo/Gojo-2.png" 
                        : "images/Gojo/Gojo-1.png";

    $: sukunaImagePath = Sukuna_Hp <= 40 ? "images/Sukuna/Sukuna-3.png" 
                          : Sukuna_Hp <= 80 ? "images/Sukuna/Sukuna-2.png" 
                          : "images/Sukuna/Sukuna-1.png";

    let Gojo_Hp = 40;
    let Sukuna_Hp = 120;
    let isGameOver = false;
    let isGameOverFinal = false; // 궁극기 애니메이션 후 GameOver 상태
    let isVictory = false;
    let isVictoryFinal = false; // 승리 메시지 상태

    let SukunaUltimateSkillClass = ''; 
    let GojoUltimateSkillClass = '';

    $: gojoHpPercent = Math.max((Gojo_Hp / 40) * 100, 0);
    $: sukunaHpPercent = Math.max((Sukuna_Hp / 120) * 100, 0);

    onMount(() => {
        if (performance.navigation.type === 1) {
            push('/');
        }

        if ($solveProblemCnt == 9999) { // 인외마경 신주쿠
            $solveProblemCnt = 120;
            Gojo_Hp = 3;

            let rate = [];
            for (let i = 0; i < $problemCnt; i++) {
                // 정답률 계산 및 문제 번호 저장
                rate.push([$correctRate[i][1] === 0 ? 1000 : ($correctRate[i][0] / $correctRate[i][1]) * 100, i]);
            }

            // 정답률 내림차순으로 정렬 (높은 정답률 -> 낮은 정답률)
            rate.sort((x, y) => y[0] - x[0] || Math.random() - 0.5);

            // 상위 120개 문제를 problem 배열에 추가
            for (let i = 0; i < 120 && i < rate.length; i++) {
                problem.push(rate[i][1]); // 문제 번호만 저장
            }

            console.log("문제 배열 (정답률 높은 순서):", problem);
        }

        else if($solveProblemCnt == 7777) { // 처음부터 순서대로
            $solveProblemCnt = $problemCnt;;
            for(let i = 0; i < 120; i++) {
                problem.push(i);
            }
        }
        else { // 랜덤으로 문제 선정
            let problemSet = new Set(); 
            while (problemSet.size < $solveProblemCnt) {
                let randNum = Math.floor(Math.random() * ($problemCnt)); 
                problemSet.add(randNum); 
            }

            problemSet.forEach(element => {
                problem.push(element);
            });
        }

        imagePath = `images/problem/${problem[curProblemNum]}.png`;
    })

    const grading = (selected) => {
        isNormal = isCorrect = isIncorrect = false;

        if (selected == $answer[problem[curProblemNum]]) {
            isCorrect = true;
            $correctRate[problem[curProblemNum]][0]++; // 맞춘 횟수
            $correctRate[problem[curProblemNum]][1]++; // 전체 횟수
            Sukuna_Hp--; // Sukuna HP 감소

            sukunaDamageClass = 'damage'; // 데미지 애니메이션 클래스 추가
            setTimeout(() => (sukunaDamageClass = ''), 500); // 일정 시간 후 클래스 제거

            if (Sukuna_Hp === 0) {
                isVictory = true;
                GojoUltimateSkillClass = 'ultimate-skill'; // 고죠 궁극기 애니메이션
                setTimeout(() => {
                    GojoUltimateSkillClass = ''; // 애니메이션 종료
                    isVictoryFinal = true; // 승리 메시지 표시
                }, 2000); // 궁극기 애니메이션 시간
                return;
            }
        } else {
            isIncorrect = true;
            $correctRate[problem[curProblemNum]][1]++; // 전체 횟수
            Gojo_Hp--;

            gojoDamageClass = 'damage';
            setTimeout(() => (gojoDamageClass = ''), 500); 

            if (Gojo_Hp === 0) {
                isGameOver = true;
                SukunaUltimateSkillClass = 'ultimate-skill'; 

                setTimeout(() => {
                    SukunaUltimateSkillClass = ''; 
                    isGameOverFinal = true; 
                }, 2000); 
                return;
            }
        }

        localStorage.setItem('correctRate', JSON.stringify($correctRate));

        // 정답이면 자동으로 다음 문제로 이동
        if (isCorrect) {
            goNext();
        }
    };

    const goNext = () => {
        if(curProblemNum == $solveProblemCnt - 1) {
            imagePath = `images/backGround.png`;
            curProblemNum = curProblemNum + 1;

            isCorrect = isIncorrect = isNormal = false;
            isEnd = true;
            return;
        }
        else if(curProblemNum == $solveProblemCnt) {
            return;
        }

        isCorrect = isIncorrect = isEnd = false;
        isNormal = true;
        curProblemNum = curProblemNum + 1;
        imagePath = `images/problem/${problem[curProblemNum]}.png`;
    };

    const goPrev = () => {
        if(curProblemNum == 0) {
            return;
        }

        isCorrect = isIncorrect = isEnd = false;
        isNormal = true;
        curProblemNum = curProblemNum - 1;
        imagePath = `images/problem/${problem[curProblemNum]}.png`;
    };

</script>

<main>
    {#if isVictoryFinal}
    <!-- 승리 메시지 -->
    <div class="victory-final">
        <h1>승리하였습니다!</h1>
        <img src="images/win.png" alt="승리 이미지">
        <p>축하합니다. 스쿠나를 물리쳤습니다!</p>
        <button on:click={() => push('/')} style="padding: 15px 25px; /* 버튼 높이와 너비 조정 */
            font-size: 1.2rem; /* 버튼 글자 크기 */
            background-color: #014949; /* 버튼 배경색 */
            color: white; /* 버튼 텍스트 색상 */
            border: none; /* 버튼 테두리 제거 */
            border-radius: 8px; /* 버튼 모서리 둥글게 */
            cursor: pointer; /* 커서 모양 변경 */
            transition: transform 0.2s, background-color 0.2s; /* 애니메이션 추가 */">메인 화면으로 돌아가기</button>
    </div>

    {:else if isVictory}
    <!-- 고죠 궁극기 애니메이션 -->
    <div class="ultimate-skill-container">
        <img src="images/GojoUltimateSkillClass.png" alt="고죠 궁극기" class={GojoUltimateSkillClass}>
    </div>
    
    {:else if isGameOverFinal}
    <!-- 패배 화면 -->
    <div class="game-over-final">
        <div class="game-over-screen" style="grid-column: 2">
            <img style="height:90vh;" src="images/GameOver.png" alt="">
            <div class=""><button on:click={() => push('/')} style="padding: 15px 25px;
                                                                font-size: 1.2rem; 
                                                                background-color: #014949; 
                                                                color: white; 
                                                                border: none; 
                                                                border-radius: 8px; 
                                                                cursor: pointer; 
                                                                margin-left:170px;
                                                                transition: transform 0.2s, background-color 0.2s;">
        메인 화면으로 돌아가기</button></div>
        </div>
    </div>

    {:else if isGameOver}
    <!-- 궁극기 애니메이션 -->
    <div class="ultimate-skill-container">
        <img src="images/SukunaUltimateSkillC.png" alt="궁극기 애니메이션" class={SukunaUltimateSkillClass}>
    </div>

    {:else}
        <div class="right-container">
            <div class="Gojo-image">
                <img src={gojoImagePath} alt="Gojo" class={gojoDamageClass}>
            </div>

            <div class="Gojo-Hp">
                <div class="hp-bar">
                    <div class="hp-bar-inner" style="width: {gojoHpPercent}%;"></div>
                </div>
                <span class="hp-label">Gojo HP: {Gojo_Hp}</span>
            </div>

        </div>
        <div class="mid-container">
            <div class="problem-container">
                <img alt="" src={imagePath} on:click={() => 
                    alert(`시도 횟수: ${$correctRate[problem[curProblemNum]][1]}\n맞춘 횟수: ${$correctRate[problem[curProblemNum]][0]}\n정답률: ${$correctRate[problem[curProblemNum]][1] == 0 ? 0 : ($correctRate[problem[curProblemNum]][0] / $correctRate[problem[curProblemNum]][1] * 100).toFixed(1)}%`)
                }>
            </div>
            <div class="select-container">
                <button on:click={goPrev}> ← 이전</button>
                <button on:click={()=>{grading(1)}}>1번</button>
                <button on:click={()=>{grading(2)}}>2번</button>
                <button on:click={()=>{grading(3)}}>3번</button>
                <button on:click={()=>{grading(4)}}>4번</button>
                <button on:click={goNext}>다음 →</button>
            </div>
        </div>

        <div class="left-container">
            <div class="Sukuna-image">
                <img src={sukunaImagePath} alt="Sukuna" class={sukunaDamageClass} >
            </div>

            <div class="Sukuna-Hp">
                <div class="hp-bar">
                    <div class="hp-bar-inner" style="width: {sukunaHpPercent}%;"></div>
                </div>
                <span class="hp-label">Sukuna HP: {Sukuna_Hp}</span>
            </div>
        </div>
    {/if}
</main>

<style>
    main {
        display: grid;
        grid-template-columns: 0.33fr 1fr 0.33fr;
        overflow: hidden;
    }

    .right-container, .left-container {
        display: grid;
        height: 100vh;
        background-color: #014949;
        grid-template-rows: 1fr 0.5fr;
    }

    .mid-container {
        display: grid;
        height: 100vh;
        background-color: white;
        grid-template-rows: 1fr 0.09fr;
    }

    .Gojo-image{
        text-align: center;
    }

    .Sukuna-image {
        text-align: center;
    }

    .Gojo-Hp, .Sukuna-Hp {
        text-align: center;
        font-size: 3rem;
    }

    .select-container {
        background-color: #0d3030;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        padding: 10px; 
    }

    .select-container button {
        padding: 15px 25px; 
        font-size: 1.2rem;
        background-color: #014949;
        color: white;
        border: none;
        border-radius: 8px; 
        cursor: pointer;
        transition: transform 0.2s, background-color 0.2s;
    }

    .select-container button:hover {
        background-color: #017a7a;
        transform: scale(1.1); 
    }

    .problem-container img {
        margin-top: 70px;
        max-height: 90%; 
        max-width: 90%;  
        min-height: 0vh;
        min-width: 0vw; 
        height: auto;     
        width: auto;     
        object-fit: contain; 
    }

    @keyframes damage-effect {
    0% {
        transform: translateX(0);
        filter: brightness(1);
    }
    25% {
        transform: translateX(-10px);
        filter: brightness(1.2) saturate(1.5);
    }
    50% {
        transform: translateX(10px);
        filter: brightness(1.2) saturate(1.5);
    }
    75% {
        transform: translateX(-5px);
    }
    100% {
        transform: translateX(0);
        filter: brightness(1);
    }
}

.damage {
    animation: damage-effect 0.6s ease-in-out;
    transition: transform 0.3s;
}

.hp-bar {
    width: 90%;
    height: 15px;
    background-color: #333;
    border-radius: 5px;
    overflow: hidden;
    margin: 0px 23px;
    position: relative;
}

.hp-bar-inner {
    height: 100%;
    background: linear-gradient(90deg, #ff4d4d, #ff9999);
    transition: width 0.3s ease-in-out;
}

.hp-label {
    font-size: 1.5rem;
    text-align: center;
    color: white;
}

.game-over-final {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 10000;
}

.game-over-final img {
    animation: game-over-pop 1.5s ease-out forwards;
}

@keyframes game-over-pop {
    0% {
        transform: scale(0.5);
        opacity: 0;
    }
    50% {
        transform: scale(1.2);
        opacity: 1;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.ultimate-skill-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    z-index: 9999;
    pointer-events: none;
}

.ultimate-skill {
    width: 80%;
    max-width: 800px;
    animation: slide-in 2s ease-out forwards;
}

@keyframes slide-in {
    0% {
        transform: translateX(100%);
        opacity: 0;
    }
    50% {
        transform: translateX(0);
        opacity: 1;
    }
    100% {
        transform: translateX(-100%);
        opacity: 0; 
    }
}

.victory-final {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.8); 
    z-index: 10000;
    text-align: center;
}

.victory-final img {
    width: 60%;
    max-width: 600px;
    margin-bottom: 20px;
}

.ultimate-skill-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    z-index: 9999;
    pointer-events: none;
}

.ultimate-skill {
    width: 80%;
    max-width: 800px;
    animation: slide-in 2s ease-out forwards;
}
</style>