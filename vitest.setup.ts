import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

global.localStorage = localStorageMock as Storage;

// Mock URL.createObjectURL and revokeObjectURL for export tests
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock document methods for file downloads
const appendChildOriginal = document.body.appendChild;
const removeChildOriginal = document.body.removeChild;

document.body.appendChild = vi.fn((node) => {
  if (node instanceof HTMLAnchorElement) {
    return node;
  }
  return appendChildOriginal.call(document.body, node);
}) as any;

document.body.removeChild = vi.fn((node) => {
  if (node instanceof HTMLAnchorElement) {
    return node;
  }
  return removeChildOriginal.call(document.body, node);
}) as any;

// Mock File.prototype.text() for file reading in tests
if (!File.prototype.text) {
  File.prototype.text = function() {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsText(this);
    });
  };
}

// Helper to create FileList from File objects
global.createFileList = (...files: File[]): FileList => {
  const fileList: Partial<FileList> = {
    length: files.length,
    item: (index: number) => files[index] || null,
  };
  files.forEach((file, index) => {
    (fileList as any)[index] = file;
  });
  return fileList as FileList;
};
