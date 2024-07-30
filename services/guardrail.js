export async function input_guardrail() {
	try {
		const rounds = await Round.find({});
		return rounds;
	} catch (error) {
		console.log(error);
		return [];
	}
}
