import{r as o,j as e,bq as d,aQ as c,B as a,fq as p,T as m,H as u,C as h}from"./index-cNRh_qft.js";import{M as x}from"./markdown-sdGgeBYa.js";import{C as f}from"./component-layout-D3xwTgqf.js";import"./html-to-markdown-wPkGdeP1.js";import"./orderBy-BP_idRMj.js";import"./Card-C_-31fGp.js";import"./CardHeader-CZZHKPlX.js";import"./CardContent-BPfTDHT5.js";const g=`
<h4>This is Heading 4</h4>
<code>This is code</code>

<pre><code class="language-javascript">for (var i=1; i &#x3C;= 20; i++) {
  if (i % 15 == 0)
    return "FizzBuzz"
  else if (i % 3 == 0)
    return "Fizz"
  else if (i % 5 == 0)
    return "Buzz"
  else
    return i
  }</code></pre>
`;function j(){const[r,i]=o.useState(!0),[s,n]=o.useState(g),l=t=>{i(t.target.checked)};return e.jsxs(f,{heroProps:{heading:"Editor",moreLinks:["https://tiptap.dev/docs/editor/introduction"]},containerProps:{maxWidth:!1},children:[e.jsx(d,{control:e.jsx(c,{name:"fullItem",checked:r,onChange:l}),label:"Full item",sx:{mb:3}}),e.jsxs(a,{sx:{rowGap:5,columnGap:3,display:"grid",alignItems:"flex-start",gridTemplateColumns:{xs:"repeat(1, 1fr)",lg:"repeat(2, 1fr)"}},children:[e.jsx(p,{fullItem:r,value:s,onChange:t=>n(t),sx:{maxHeight:720}}),e.jsxs(a,{sx:{p:3,borderRadius:2,overflowX:"auto",bgcolor:"background.neutral"},children:[e.jsx(m,{variant:"h6",children:"Preview"}),e.jsx(x,{children:s})]})]})]})}const C={title:`Editor | Components - ${h.appName}`};function y(){return e.jsxs(e.Fragment,{children:[e.jsx(u,{children:e.jsxs("title",{children:[" ",C.title]})}),e.jsx(j,{})]})}export{y as default};
