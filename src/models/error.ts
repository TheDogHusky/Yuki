import mongoose from 'mongoose';
import { IError } from '../structures/types';

const schema = new mongoose.Schema({
	ErrorID: String,
	ErrorDate: Date,
	ErrorMessage: String,
	ErrorStack: String,
	ErrorFrom: Object,
});

export default mongoose.model<IError>('Errors', schema);