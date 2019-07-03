<template>
    <div class="editor">
        <Modal ref="ytmodal" @onConfirm="addCommand" />        
        <editor-menu-bar :editor="editor" v-slot="{ commands, isActive}" style="height:35px;border-bottom:1px solid;padding-top:5px;">
            <div class="menubar">
                <button          
                    @click="openModal(commands.image)"
                >
                    <v-icon color="green">add_photo_alternate</v-icon>
                </button>
                &nbsp;

                <button
                    class="menubar__button"
                    :class="{ 'is-active': isActive.bold() }"
                    @click="commands.bold"
                >
                    <v-icon color="black">format_bold</v-icon>
                </button>
                &nbsp;

                <button
                    class="menubar__button"
                    :class="{ 'is-active': isActive.italic() }"
                    @click="commands.italic"
                >
                    <v-icon color="black">format_italic</v-icon>
                </button>
                &nbsp;

                <button
                    class="menubar__button"
                    :class="{ 'is-active': isActive.strike() }"
                    @click="commands.strike"
                >
                    <v-icon color="black">format_strikethrough</v-icon>
                </button>
                &nbsp;

                <button
                    class="menubar__button"
                    :class="{ 'is-active': isActive.underline() }"
                    @click="commands.underline"
                >
                    <v-icon color="black">format_underlined</v-icon>
                </button>
                &nbsp;

                <button
                    class="menubar__button"
                    :class="{ 'is-active': isActive.code() }"
                    @click="commands.code"
                >
                    <v-icon color="black">code</v-icon>
                </button> 
                &nbsp;

                <button
                    class="menubar__button"
                    :class="{ 'is-active': isActive.heading({ level: 1 }) }"
                    @click="commands.heading({ level: 1 })"
                >
                    H1
                </button>
                &nbsp;

                <button
                    class="menubar__button"
                    :class="{ 'is-active': isActive.heading({ level: 2 }) }"
                    @click="commands.heading({ level: 2 })"
                >
                    H2
                </button>
                &nbsp;

                <button
                    class="menubar__button"
                    :class="{ 'is-active': isActive.heading({ level: 3 }) }"
                    @click="commands.heading({ level: 3 })"
                >
                    H3
                </button>
                &nbsp;

                <button
                    class="menubar__button"
                    :class="{ 'is-active': isActive.bullet_list() }"
                    @click="commands.bullet_list"
                >
                    <v-icon color="black">format_list_bulleted</v-icon>
                </button>
                &nbsp;

                <button
                    class="menubar__button"
                    :class="{ 'is-active': isActive.ordered_list() }"
                    @click="commands.ordered_list"
                >
                    <v-icon color="black">format_list_numbered</v-icon>
                </button>
                &nbsp;

                <button
                    class="menubar__button"
                    :class="{ 'is-active': isActive.blockquote() }"
                    @click="commands.blockquote"
                >
                    <v-icon color="black">format_quote</v-icon>
                </button> 
                &nbsp; 

                <button
                    class="menubar__button"
                    @click="commands.horizontal_rule"
                >
                    <v-icon color="black">remove</v-icon>
                </button>
                &nbsp;

                <button
                    class="menubar__button"
                    @click="commands.undo"
                >
                    <v-icon color="green">undo</v-icon>
                </button>
                &nbsp;

                <button
                    class="menubar__button"
                    @click="commands.redo"
                >
                    <v-icon color="green">redo</v-icon>
                </button>
            </div>
        </editor-menu-bar>
        <editor-content class="editor__content" :editor="editor" />
    </div>
</template>

<script>
//Basic Editor
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';

//Title & Contents
import { Placeholder } from 'tiptap-extensions';
import Contents from './Contents'
import Title from './Title'

//Button
import { 
    Image,
    Bold,  
    Italic,
    Strike,
    HardBreak,
    Heading,
    HorizontalRule,
    OrderedList,
    BulletList,
    ListItem,
    Code,
    Underline,
    History,
    Blockquote,
    Link
} from 'tiptap-extensions';
import Modal from "./ImageUploadModal";

export default {
    components: {        
        EditorContent,
        EditorMenuBar,
        Modal,
    },    
    data() {
        return {
            editor: new Editor({
                autoFocus: true,
                extensions: [        
                    //Editor Icon  
                    new Image(),
                    new Bold(),        
                    new Italic(),
                    new Strike(),
                    new HardBreak(),
                    new Heading({ levels: [1, 2, 3] }),
                    new HorizontalRule(),
                    new OrderedList(),
                    new BulletList(),
                    new ListItem(),
                    new Code(),
                    new Underline(),
                    new History(),
                    new Blockquote(),
                    new Link(),

                    //Title & Body
                    new Contents(),
                    new Title(),
                    new Placeholder({
                        showOnlyCurrent: false,
                        emptyNodeText: node => {
                            if (node.type.name === 'title') {
                                return 'Title';
                            }
                            return 'Contents';
                        },
                    }),                
                ],       
            }),
        }    
     },
    beforeDestroy() {
        this.editor.destroy();
    },
    methods: {    
        openModal(command) {
        //open image uploading pop-up
            this.$refs.ytmodal.showModal(command);
        },
        addCommand(data) {
        //add selected image
            if (data.command !== null) {         
                data.command(data.data);
            }
        },
    },
}
</script>

<style lang="scss">
    // Title & Content
    .editor *.is-empty:nth-child(1)::before,
    .editor *.is-empty:nth-child(2)::before {
        content: attr(data-empty-text);
        float: left;
        color: #aaa;
        pointer-events: none;
        height: 0;
        font-style: italic;
    }
</style>
