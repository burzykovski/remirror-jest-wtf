import React, { useState, MouseEventHandler, useCallback } from "react";
import {
  AllStyledComponent,
  CountExtension,
  BoldExtension,
  ItalicExtension,
  PlaceholderExtension,
  BulletListExtension,
  ThemeProvider,
  Remirror,
  useRemirror,
  useActive,
  useCommands,
  useRemirrorContext,
  useEditorEvent,
  useHelpers,
  ToggleBoldButton,
  ToggleItalicButton,
  ToggleBulletListButton,
} from "@my/remirror";
import styled from "@emotion/styled";

const StyledEditorComponent = styled.div`
  background-color: #f2f4f5;
  border-radius: 4px;
  padding: 14px 16px;

  & ul {
    margin: 0;
  }

  & .ProseMirror {
    padding: 0 !important;
    min-height: 40px !important;
  }
`;

const EditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const CounterWrapper = styled.span`
  align-self: flex-end;
`;

const Counter = () => {
  const { getCharacterCount } = useHelpers(true);
  const count = getCharacterCount();

  return <CounterWrapper>{count}/520</CounterWrapper>;
};

const MyEditorComponent = () => {
  const { getRootProps } = useRemirrorContext();
  const { getHTML } = useHelpers();
  const rootProps = getRootProps();

  useEditorEvent("blur", () => {
    console.log(getHTML());
  });

  return (
    <EditorWrapper>
      <StyledEditorComponent {...rootProps}>
        <Menu />
      </StyledEditorComponent>
      <Counter />
    </EditorWrapper>
  );
};

export const Menu = () => {
  const [visible, setVisible] = useState(false);
  const { toggleBold, focus, toggleItalic, toggleBulletList } = useCommands();
  const active = useActive();

  useEditorEvent("blur", () => setVisible(false));
  useEditorEvent("focus", () => setVisible(true));

  const handleMouseDown: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.preventDefault();
    },
    []
  );

  if (!visible) {
    return null;
  }

  return (
    <div>
      <ToggleBoldButton />
      <ToggleItalicButton />
      <ToggleBulletListButton />
      <button
        onMouseDown={handleMouseDown}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleBold();
          focus();
        }}
        style={{ fontWeight: active.bold() ? "bold" : undefined }}
      >
        B
      </button>
    </div>
  );
};
export const MyEditor = () => {
  const { manager, state } = useRemirror({
    extensions: () => [
      // these extensions are needed to create bullet list only editor - may be used in the future
      // new DocExtension({ content: "bulletList+" }),
      // new ListItemExtension({
      //   nodeOverride: { content: "text*" },
      // }),
      new BulletListExtension({}),
      new BoldExtension(),
      new ItalicExtension(),
      new PlaceholderExtension({
        placeholder:
          "Write down the main responsibilities (e.g. unpacking deliveries, preparing salads)",
      }),
      new CountExtension({ maximum: 520 }),
    ],
    content: "",
    selection: "start",
    stringHandler: "html",
  });

  return (
    <div data-testid="container">
      <AllStyledComponent>
        <ThemeProvider
          theme={{
            color: {
              border: "none",
              active: { border: "none" },
              outline: "none",
            },
          }}
        >
          <Remirror manager={manager} initialContent={state}>
            <MyEditorComponent />
          </Remirror>
        </ThemeProvider>
      </AllStyledComponent>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div style={{ padding: 16 }}>
      <MyEditor />
    </div>
  );
};

export default App;
