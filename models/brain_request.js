const PromptType = {
	ASSISTANT: 'ASSISTANT',
	USER: 'USER'
};

class PromptMessage {
	constructor(message, prompt_type) {
		this.message = message;
		this.prompt_type = prompt_type;
	}
}

class BrainRequest {
	constructor(app_id, user_id, temperature, model, model_name, system_prompt, prompt, memory = []) {
		this.app_id = app_id;
		this.user_id = user_id;
		this.temperature = temperature;
		this.model = model;
		this.model_name = model_name;
		this.system_prompt = system_prompt;
		this.prompt = prompt;
		this.memory = memory;
	}
}

export default BrainRequest;
