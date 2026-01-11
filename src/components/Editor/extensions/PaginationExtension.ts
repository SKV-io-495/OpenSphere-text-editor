import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export const PaginationExtension = Extension.create({
  name: 'pagination',

  addProseMirrorPlugins() {
    const pluginKey = new PluginKey('pagination');

    return [
      new Plugin({
        key: pluginKey,
        state: {
          init() {
            return DecorationSet.empty;
          },
          apply(tr, value) {
            if (tr.getMeta(pluginKey)) {
              return tr.getMeta(pluginKey).decorations;
            }
            return value.map(tr.mapping, tr.doc);
          },
        },
        props: {
          decorations(state) {
            return pluginKey.getState(state);
          },
        },
        view(editorView) {
          return {
            update(view, prevState) {
               // Optimization: Only recalc if doc structure changed
               const isDocChanged = !view.state.doc.eq(prevState.doc);
               const isSelectionChanged = !view.state.selection.eq(prevState.selection);
               
               if (!isDocChanged && !isSelectionChanged) return;
               
               requestAnimationFrame(() => {
                 if (view.isDestroyed) return;

                 const calculateBreaks = () => {
                     const decorations: Decoration[] = [];
                     // 1056px = 11 inches @ 96DPI
                     const PAGE_HEIGHT = 1056; 
                     let currentPageBottom = PAGE_HEIGHT;
                     
                     view.state.doc.forEach((node, pos) => {
                        if (!node.isBlock) return;

                        const dom = view.nodeDOM(pos) as HTMLElement;
                        if (!dom) return;
                        
                        // Strict DOM measurements
                        const top = dom.offsetTop; 
                        const height = dom.offsetHeight;
                        const bottom = top + height;
                        
                        // If this node pushes past the current page boundary
                        if (bottom > currentPageBottom) {
                           while (bottom > currentPageBottom) {
                              // Insert the visual break marker
                              decorations.push(
                                Decoration.widget(pos, () => {
                                  const el = document.createElement('div');
                                  el.className = 'page-break-marker';
                                  el.innerText = "--- PAGE BREAK ---"; // Visual label
                                  return el;
                                }, { side: -1 }) 
                              );
                              
                              // Move to next page target
                              currentPageBottom += PAGE_HEIGHT;
                           }
                        }
                     });
                     
                     const transaction = view.state.tr.setMeta(pluginKey, { 
                         decorations: DecorationSet.create(view.state.doc, decorations) 
                     });
                     view.dispatch(transaction);
                 };
                 
                 calculateBreaks();
               });
            }
          }
        }
      })
    ];
  },
});
