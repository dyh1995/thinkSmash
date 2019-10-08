
import React from 'react';//创建组件，虚拟DOM元素，必须这么写
export default function Index(props){
//如果在一个组件中return一个null。则表示此组件是空的，什么都不会渲染
 
//在组件中，必须返回一个合法的JSX虚拟DOM元素
//props.name='zs'
//结论：不论是vue还是react，组件中的props永远都是只读的，不能被重新赋值
 
    return (
        <div>
            <p>Edit <code>src/App.js</code> and save to reload.</p>
            <a className="app-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">Learn React</a>
        </div>
    )
}