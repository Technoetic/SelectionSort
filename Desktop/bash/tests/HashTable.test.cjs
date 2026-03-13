const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');

// HashTable 클래스를 로드
const code = fs.readFileSync('./src/js/HashTable.js', 'utf8');
const HashTable = new Function(code + '\nreturn HashTable;')();

describe('HashTable', () => {
  test('생성자: 기본 크기 7로 초기화', () => {
    const ht = new HashTable();
    assert.strictEqual(ht.getSize(), 7);
    assert.strictEqual(ht.getCount(), 0);
  });

  test('생성자: 커스텀 크기로 초기화', () => {
    const ht = new HashTable(13);
    assert.strictEqual(ht.getSize(), 13);
  });

  test('insert: 단일 항목 삽입', () => {
    const ht = new HashTable(7);
    const result = ht.insert('홍길동', '010-1234-5678');
    assert.strictEqual(typeof result.index, 'number');
    assert.strictEqual(result.index >= 0 && result.index < 7, true);
    assert.strictEqual(result.collision, false);
    assert.strictEqual(ht.getCount(), 1);
  });

  test('insert: 동일 키 업데이트', () => {
    const ht = new HashTable(7);
    ht.insert('김철수', '010-1111-1111');
    const result = ht.insert('김철수', '010-2222-2222');
    assert.strictEqual(result.updated, true);
    assert.strictEqual(ht.getCount(), 1);

    const found = ht.search('김철수');
    assert.strictEqual(found.value, '010-2222-2222');
  });

  test('insert: 충돌 감지', () => {
    const ht = new HashTable(3);
    ht.insert('a', '111');
    ht.insert('b', '222');
    ht.insert('c', '333');
    // 크기 3이면 최소 하나는 충돌
    const buckets = ht.getBuckets();
    const hasCollision = buckets.some(b => b.hasCollision);
    assert.strictEqual(ht.getCount(), 3);
  });

  test('search: 존재하는 키 검색', () => {
    const ht = new HashTable(7);
    ht.insert('이영희', '010-3333-3333');
    const result = ht.search('이영희');
    assert.strictEqual(result.found, true);
    assert.strictEqual(result.value, '010-3333-3333');
    assert.strictEqual(result.steps >= 1, true);
  });

  test('search: 존재하지 않는 키 검색', () => {
    const ht = new HashTable(7);
    ht.insert('박민수', '010-4444-4444');
    const result = ht.search('없는사람');
    assert.strictEqual(result.found, false);
    assert.strictEqual(result.value, null);
  });

  test('delete: 존재하는 키 삭제', () => {
    const ht = new HashTable(7);
    ht.insert('정수진', '010-5555-5555');
    assert.strictEqual(ht.getCount(), 1);

    const result = ht.delete('정수진');
    assert.strictEqual(result.deleted, true);
    assert.strictEqual(ht.getCount(), 0);

    const found = ht.search('정수진');
    assert.strictEqual(found.found, false);
  });

  test('delete: 존재하지 않는 키 삭제', () => {
    const ht = new HashTable(7);
    const result = ht.delete('없는사람');
    assert.strictEqual(result.deleted, false);
  });

  test('getAll: 모든 항목 반환', () => {
    const ht = new HashTable(7);
    ht.insert('A', '1');
    ht.insert('B', '2');
    ht.insert('C', '3');
    const all = ht.getAll();
    assert.strictEqual(all.length, 3);
  });

  test('getBuckets: 버킷 상태 반환', () => {
    const ht = new HashTable(7);
    const buckets = ht.getBuckets();
    assert.strictEqual(buckets.length, 7);
    assert.strictEqual(buckets[0].isEmpty, true);
  });

  test('getLoadFactor: 적재율 계산', () => {
    const ht = new HashTable(10);
    ht.insert('A', '1');
    ht.insert('B', '2');
    ht.insert('C', '3');
    assert.strictEqual(ht.getLoadFactor(), 0.3);
  });

  test('resize: 테이블 크기 변경 및 재해싱', () => {
    const ht = new HashTable(5);
    ht.insert('X', '1');
    ht.insert('Y', '2');
    ht.insert('Z', '3');

    ht.resize(11);
    assert.strictEqual(ht.getSize(), 11);
    assert.strictEqual(ht.getCount(), 3);

    assert.strictEqual(ht.search('X').found, true);
    assert.strictEqual(ht.search('Y').found, true);
    assert.strictEqual(ht.search('Z').found, true);
  });

  test('clear: 테이블 초기화', () => {
    const ht = new HashTable(7);
    ht.insert('A', '1');
    ht.insert('B', '2');
    ht.clear();
    assert.strictEqual(ht.getCount(), 0);
    assert.strictEqual(ht.search('A').found, false);
  });

  test('getHashSteps: 해시 계산 과정 반환', () => {
    const ht = new HashTable(7);
    ht.insert('abc', '123');
    const steps = ht.getHashSteps();
    assert.strictEqual(steps.length, 3);
    assert.strictEqual(steps[0].char, 'a');
    assert.strictEqual(typeof steps[0].charCode, 'number');
    assert.strictEqual(typeof steps[0].runningHash, 'number');
  });
});
