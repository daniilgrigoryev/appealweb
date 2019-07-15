import React from 'react'
import * as _ from 'lodash'
import {Button} from 'element-react'
import {EPicker} from '../components/picker.js'
import {post,postFile,mpt,get} from '../../services/ajax.js'

export default class IncomingPosts extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
     	edo: '',
    	posts: []
    }
    
    this.setter = this.setter.bind(this);
    this.setterPosts = this.setterPosts.bind(this);
    this.addPost = this.addPost.bind(this);
    this.removePost = this.removePost.bind(this);
    this.save = this.save.bind(this);
  }
    
  setter(field,val){ 
  	this.setState({[field]:val});
  }
  
  setterPosts(index,field,val){
  	const {posts} = this.state;
  	posts[index][field]=val;
    this.setState({posts});
  }
  
  addPost(){
  	const {posts} = this.state;
  	posts.push({num:'',date:''});
    this.setState({posts});
  }
  
  removePost(index){
  	let {posts} = this.state;
  	posts=posts.filter((x,i)=>i!=index);
    this.setState({posts});  
  }
  
  save(){
  
  }
  
  render() {
  	const {edo,posts}=this.state;
  
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td colSpan='2'>Номер в ЭДО</td>
              <td><input type='text' value={edo} onChange={(e)=>this.setter('edo',e.target.value)} /></td>
            </tr>
          </tbody>
       </table>

       <table>
          <tbody>
            <tr>
              <td colSpan='2'>N постановления</td>
              <td>Дата</td>
            </tr>
            
            {posts.map((x,i)=>(
                <tr>
                <td><Button onClick={()=>this.removePost(i)} >-</Button></td>
                  <td><input type='text' value={x.num}  onChange={(e)=>this.setterPosts(i,'num',e.target.value)} /></td>
                  <td><EPicker value={x.date} onChange={(x)=>this.setterPosts(i,'date',x)} date='+' /></td>
                </tr>)
            )}           
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <td><Button onClick={this.addPost}>+</Button></td>
              <td colSpan='2' ><Button onClick={this.save} >Сохранить</Button></td>
            </tr>        
          </tbody>
        </table>
      </div>
    ); //
  }
}