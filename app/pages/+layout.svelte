<script>
	import '@evidence-dev/tailwind/fonts.css';
	import '../app.css';
	import { EvidenceDefaultLayout } from '@evidence-dev/core-components';
	export let data;
</script>

<EvidenceDefaultLayout
	{data}
	title="Opencode Dash"
	githubRepo="https://github.com/MuhammadOmarMuhdhar/opencode-dash"
	neverShowQueries
>
	<slot slot="content" />
</EvidenceDefaultLayout>
