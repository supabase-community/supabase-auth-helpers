import { describe, expect, it } from 'vitest';
import { combineChunks, createChunks } from '../src/chunker';
import { CHUNK_STRING, DOUBLE_CHUNK_STRING, len } from './helper';

describe('chunker', () => {
	it('should not chunk and return one item', () => {
		const chunked = createChunks('my-chunks', 'hello-world');
		expect(chunked.length).toBe(1);
	});

	it('should chunk and return two chunks', () => {
		const chunked = createChunks('my-chunks', CHUNK_STRING, 2000);
		const combined = combineChunks('my-chunks', (name) => {
			let chunk = chunked.find((chunk) => {
				return chunk.name === name;
			});
			return chunk?.value;
		});
		expect(chunked.length).toBe(2);
		expect(combined).toBe(CHUNK_STRING);
	});

	it('should chunk and return twelve chunks', () => {
		const chunked = createChunks('my-chunks', CHUNK_STRING, 320);
		const combined = combineChunks('my-chunks', (name) => {
			let chunk = chunked.find((chunk) => {
				return chunk.name === name;
			});
			return chunk?.value;
		});
		expect(chunked.length).toBe(12);
		expect(combined).toBe(CHUNK_STRING);
	});

	it('should chunk and return one hundred and one chunks', () => {
		const chunked = createChunks('my-chunks', CHUNK_STRING, 36);
		const combined = combineChunks('my-chunks', (name) => {
			let chunk = chunked.find((chunk) => {
				return chunk.name === name;
			});
			return chunk?.value;
		});
		expect(chunked.length).toBe(101);
		expect(combined).toBe(CHUNK_STRING);
	});

	it('should chunk and return correct size chunks', async () => {
		const key = 'sb-xdbaubpgcisziicojymj-auth-token';
		const chunked = createChunks(key, DOUBLE_CHUNK_STRING);
		const combined = await combineChunks(key, (name) => {
			let chunk = chunked.find((chunk) => {
				return chunk.name === name;
			});
			return chunk?.value;
		});

		chunked.forEach((chunk, i) => {
			expect(chunk.name).toBe(`${key}.${i}`);
			expect([3217, 3217, 899]).toContain(len(`${chunk.name}=${chunk.value}`));
		});

		expect(chunked.length).toBe(3);
		expect(len(`${key}=${DOUBLE_CHUNK_STRING}`)).toBe(7257);
		expect(combined).toBe(DOUBLE_CHUNK_STRING);
	});
});
