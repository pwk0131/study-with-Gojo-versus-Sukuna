<script>
	import { push } from "svelte-spa-router";
	import { problemCnt, solveProblemCnt, correctRate, answer} from "../lib/store";
	import { onMount } from "svelte";

	const charType = ['home', 'normal', 'correct', 'incorrect'];

    $: problemUrls = [...Array(120).keys()].map((key) => `images/problem/${key}.PNG`);
    $: preloadImageUrls = ["images/backGround.png", ...problemUrls];
	
	const resetData = async () => {
        localStorage.clear();
        await initCorrectRate();

        alert("데이터 파일이 초기화되었습니다");
    };

	const initCorrectRate = async () => {
        // correctRate의 초기화 파일에서 데이터 가져옴
        let fromFile = await fetch('dataFile/correctRate.txt'); 
        let data = await fromFile.text();

        // local storage의 correctRate 초기화
        localStorage.setItem('correctRate', JSON.stringify(data.split('\n').map(n => n.trim()).map(line => line.split(' ').map(Number))));
        let correctRateData = localStorage.getItem('correctRate');
        $correctRate = JSON.parse(correctRateData);
    };

	const getData = async () => {
        // get answer 
        let response = await fetch('dataFile/answer.txt'); 
        let text = await response.text();
        $answer = text.split('\n').map(n => n.trim()).map(n => parseInt(n, 10)) 

        // get correctRate
        let correctRateData = localStorage.getItem('correctRate');
        if(correctRateData) {
            $correctRate = JSON.parse(correctRateData);
        }
        else {
            await initCorrectRate();
        }
    };

	onMount(() => {
        getData();
    })
</script>

<main>
	<div class="image-container">

		<div class="background-img">
			<img alt="" style="height: 90vh;" src="images/backGround.png">
		</div>
	</div>

	<div class="right-container">
		<div class="right-top-container">
			<div class="text-field" style="margin-top: 0px; padding:40px;">
				<t style=";">스쿠나를 쓰러뜨리는 고죠식 해답!<br/> 최강 공부법으로<br/> 소프트웨어 공학 A+ 쟁취하자</t>
			</div>
		</div>
		<div class="right-bottom-container">
			<div class="btn-1"><button on:click={()=> { $solveProblemCnt = 7777; push('/solve')}}>순서대로 <br/>모든 문제 풀기</button></div>
			<div class="btn-2"><button on:click={()=> { $solveProblemCnt = $problemCnt; push('/solve')}}>랜덤으로 <br/>모든 문제 풀기</button></div>
			<div class="btn-3"><button on:click={resetData}>데이터 삭제</button></div>
			<div class="special-container">
				<button class="btn-special" on:click={() => { $solveProblemCnt = 9999; push('/solve') }}>인외마경 <br />신주쿠 결전</button>
			</div>
	</div>

	<div class="footer">
		
	</div>

</main>

<style>

	main {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}

	.right-container {
		display: grid;
		grid-template-rows: 1fr 1fr;
	}

	.right-top-container {
		background-color: rgb(33, 31, 41);
		color: #1e3135;
		-webkit-text-stroke: 1.5px #d4c677;
		font: 3.6rem sans-serif;
		font-weight: bold;
		text-align: center;
	}

	.right-bottom-container {
		display: grid;
		grid-template-rows: 1fr 1fr;
		grid-template-columns: 1fr 1fr;

	}
	button {
        width: 300px;
        height: 80px;
        font-size: 1.8rem;
        margin: 20px auto; /* 버튼을 수평 가운데 정렬 */
        background-color: #014949;
        color: white;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        text-align: center;
        padding: 0; /* 불필요한 기본 여백 제거 */
    }

    button:hover {
        background-color: #017a7a;
        transform: translateY(-5px);
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.3);
    }

    button.btn-special {
        height: 100px;
        font-size: 2rem;
        background-color: #ff6347;
        box-shadow: 0 6px 10px rgba(255, 99, 71, 0.8);
        animation: pulse 1.5s infinite;
    }

    button.btn-special:hover {
        background-color: #ff4500;
        transform: translateY(-5px) scale(1.05);
        box-shadow: 0 12px 18px rgba(255, 69, 0, 1);
    }

    @keyframes pulse {
        0% {
            box-shadow: 0 0 10px rgba(255, 99, 71, 0.8);
        }
        50% {
            box-shadow: 0 0 20px rgba(255, 99, 71, 1);
        }
        100% {
            box-shadow: 0 0 10px rgba(255, 99, 71, 0.8);
        }
    }
</style>