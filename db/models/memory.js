import mongoose from 'mongoose';

const memorySchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			default: uuidv4
		},
		moment: {
			type: Date,
			index: true
		},
		user_id: {
			type: String,
			index: true
		},
		time_elapsed: {
			type: Number,
			default: 0
		},
		gin_activated: {
			type: Boolean,
			default: false
		},
		gout_activated: {
			type: Boolean,
			default: false
		},
		system_prompt: String,
		input: String,
		output: String
	},
	{ timestamps: true }
);

memorySchema.statics.createMemory = async function (
	user_id,
	system_prompt,
	input,
	output,
	time_elapsed = 0,
	gin_activated = false,
	gout_activated = false
) {
	const moment = new Date();
	try {
		const newMemory = new this({
			moment,
			user_id,
			system_prompt,
			input,
			output,
			time_elapsed,
			gin_activated,
			gout_activated
		});

		await newMemory.save();
		console.log('Memory created successfully:', newMemory);
		return newMemory;
	} catch (error) {
		console.error('Error creating memory:', error);
		throw error;
	}
};

memorySchema.statics.getLastMemories = async function (user_id) {
	try {
		const memories = await this.find({
			user_id: user_id,
			gin_activated: false,
			gout_activated: false
		})
			.sort({ moment: -1 })
			.limit(10)
			.exec();

		console.log('Retrieved memories:', memories);
		return memories;
	} catch (error) {
		console.error('Error retrieving memories:', error);
		throw error;
	}
};

const Memory = mongoose.model('Memory', memorySchema);

export default Memory;
