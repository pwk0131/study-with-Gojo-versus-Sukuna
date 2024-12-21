<script>
  import Router from 'svelte-spa-router';
  import MainPagee from "./routes/MainPage.svelte";
  import Solve from './routes/Solve.svelte';

  const routes = {
    '/': MainPagee,
    '/solve': Solve,
  };
</script>

<Router {routes}/>

