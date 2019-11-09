<template>
  <ckeditor :editor="editor" :value="value" @input="changeEditorData" :config="editorConfig"></ckeditor>
</template>
<script>
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'

import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold'
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic'
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Code from '@ckeditor/ckeditor5-basic-styles/src/code';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';

import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption'
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle'
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar'
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload'
import Image from '@ckeditor/ckeditor5-image/src/image'

import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';

import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials'
import LinkPlugin from '@ckeditor/ckeditor5-link/src/link'
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter'
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat'
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote'
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage'
import Heading from '@ckeditor/ckeditor5-heading/src/heading'
import List from '@ckeditor/ckeditor5-list/src/list'
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'
import Font from '@ckeditor/ckeditor5-font/src/font'
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat'
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation'
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight'
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed'
export default {
  name: 'editor',
  methods: {
    changeEditorData(content, event, editor) {
      if (content) {
        this.$emit('input', content)
      }
    }
  },
  props: {
    value: {
      required: true,
      validator: function(value) {
        let type = typeof value
        if (type === 'string' || type === 'undefined') {
          return true
        } else {
          return false
        }
      }
      // type: [String]
    }
  },
  data() {
    return {
      editor: ClassicEditor,
      editorData: '',
      editorConfig: {
        // The configuration of the editor.
        plugins: [
          EssentialsPlugin,
          BoldPlugin,
          ItalicPlugin,
          LinkPlugin,
          ParagraphPlugin,
          UploadAdapter,
          Autoformat,
          BlockQuote,
          EasyImage,
          Heading,
          Image,
          ImageCaption,
          ImageStyle,
          ImageToolbar,
          ImageUpload,
          List,
          Alignment,
          Font,
          Underline,
          Strikethrough,
          Code,
          Subscript,
          Superscript,
          RemoveFormat,
          TextTransformation,
          Highlight,
          Table,
          TableToolbar,
          MediaEmbed
        ],
        toolbar: {
          items: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'undo',
            'redo',
            'alignment',
            'bulletedList',
            'numberedList',
            'imageUpload',
            'blockQuote',
            'fontSize',
            'fontFamily',
            'fontColor',
            'fontBackgroundColor',
            'underline',
            'strikethrough',
            'code',
            'subscript',
            'superscript',
            'removeFormat',
            'highlight',
            'insertTable',
            'mediaEmbed'
          ]
        },
        mediaEmbed: {
          removeProviders: [ 'instagram', 'twitter', 'googleMaps', 'flickr', 'facebook' ]
        },
        table: {
          contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
        },
        image: {
          toolbar: [
            'imageStyle:full',
            'imageStyle:side',
            '|',
            'imageTextAlternative'
          ]
        },
        fontFamily: {
          options: [
            'default',
            'Ubuntu, Arial, sans-serif',
            'Ubuntu Mono, Courier New, Courier, monospace',
            'Microsoft YaHei'
          ]
        },
        fontSize: {
          options: [
            9,
            11,
            13,
            'default',
            17,
            19,
            21
          ]
        },
        fontColor: {
          colors: [
            {
              color: 'hsl(0, 0%, 0%)',
              label: 'Black'
            },
            {
              color: 'hsl(0, 0%, 30%)',
              label: 'Dim grey'
            },
            {
              color: 'hsl(0, 0%, 60%)',
              label: 'Grey'
            },
            {
              color: 'hsl(0, 0%, 90%)',
              label: 'Light grey'
            },
            {
              color: 'hsl(0, 0%, 100%)',
              label: 'White',
              hasBorder: true
            },
            // ...
          ]
        },
        fontBackgroundColor: {
          colors: [
            {
              color: 'hsl(0, 75%, 60%)',
              label: 'Red'
            },
            {
              color: 'hsl(30, 75%, 60%)',
              label: 'Orange'
            },
            {
              color: 'hsl(60, 75%, 60%)',
              label: 'Yellow'
            },
            {
              color: 'hsl(90, 75%, 60%)',
              label: 'Light green'
            },
            {
              color: 'hsl(120, 75%, 60%)',
              label: 'Green'
            },
            // ...
          ]
        },
      },
    }
  }
}
</script>