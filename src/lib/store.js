import { writable } from 'svelte/store';

export let problemCnt = writable(120); // 전체 문제
export let solveProblemCnt = writable(0);  // 풀 문제

export let correctRate = writable([]); // 맞춘 횟수 / 푼 횟수
export let answer = writable([]); // 정답