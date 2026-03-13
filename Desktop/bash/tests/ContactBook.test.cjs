const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');

// HashTable과 ContactBook 클래스를 로드
const htCode = fs.readFileSync('./src/js/HashTable.js', 'utf8');
const cbCode = fs.readFileSync('./src/js/ContactBook.js', 'utf8');
const HashTable = new Function(htCode + '\nreturn HashTable;')();
const ContactBook = new Function('HashTable', cbCode + '\nreturn ContactBook;')(HashTable);

describe('ContactBook', () => {
  test('addContact: 연락처 추가 성공', () => {
    const ht = new HashTable(7);
    const cb = new ContactBook(ht);
    const result = cb.addContact('홍길동', '010-1234-5678');
    assert.strictEqual(result.success, true);
    assert.strictEqual(typeof result.index, 'number');
  });

  test('addContact: 빈 이름 오류', () => {
    const ht = new HashTable(7);
    const cb = new ContactBook(ht);
    const result = cb.addContact('', '010-1234-5678');
    assert.strictEqual(result.success, false);
    assert.ok(result.error);
  });

  test('addContact: 빈 전화번호 오류', () => {
    const ht = new HashTable(7);
    const cb = new ContactBook(ht);
    const result = cb.addContact('홍길동', '');
    assert.strictEqual(result.success, false);
    assert.ok(result.error);
  });

  test('findContact: 존재하는 연락처 검색', () => {
    const ht = new HashTable(7);
    const cb = new ContactBook(ht);
    cb.addContact('김철수', '010-2222-2222');
    const result = cb.findContact('김철수');
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.found, true);
    assert.strictEqual(result.value, '010-2222-2222');
  });

  test('findContact: 존재하지 않는 연락처 검색', () => {
    const ht = new HashTable(7);
    const cb = new ContactBook(ht);
    const result = cb.findContact('없는사람');
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.found, false);
  });

  test('findContact: 빈 이름 오류', () => {
    const ht = new HashTable(7);
    const cb = new ContactBook(ht);
    const result = cb.findContact('');
    assert.strictEqual(result.success, false);
  });

  test('removeContact: 연락처 삭제 성공', () => {
    const ht = new HashTable(7);
    const cb = new ContactBook(ht);
    cb.addContact('이영희', '010-3333-3333');
    const result = cb.removeContact('이영희');
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.deleted, true);
  });

  test('removeContact: 존재하지 않는 연락처 삭제', () => {
    const ht = new HashTable(7);
    const cb = new ContactBook(ht);
    const result = cb.removeContact('없는사람');
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.deleted, false);
  });

  test('getAllContacts: 모든 연락처 반환', () => {
    const ht = new HashTable(7);
    const cb = new ContactBook(ht);
    cb.addContact('A', '1');
    cb.addContact('B', '2');
    const contacts = cb.getAllContacts();
    assert.strictEqual(contacts.length, 2);
  });

  test('getStats: 통계 정보 반환', () => {
    const ht = new HashTable(7);
    const cb = new ContactBook(ht);
    cb.addContact('A', '1');
    cb.addContact('B', '2');
    const stats = cb.getStats();
    assert.strictEqual(stats.total, 2);
    assert.strictEqual(stats.tableSize, 7);
    assert.strictEqual(typeof stats.loadFactor, 'number');
    assert.strictEqual(typeof stats.collisionCount, 'number');
    assert.ok(Array.isArray(stats.buckets));
  });
});
