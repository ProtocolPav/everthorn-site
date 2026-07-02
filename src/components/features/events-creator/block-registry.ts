// Simple block registry for types
export type Block = {
  block_id: number;
  position: number;
  type: string;
  [key: string]: any; // Additional block-specific fields
};

export type BlockId = number;
export type BlockPosition = number;

export type BlockTypeRegistry = {
  [key: string]: {
    label: string;
    icon: string;
    factory: (id: number, position: number) => Block;
    editorPath: string;
  };
};

export type CreateBlockFn = (id: number, position: number) => Block;
export type UpdateBlockFn = (block: Block, partial: Partial<Block>) => Block;