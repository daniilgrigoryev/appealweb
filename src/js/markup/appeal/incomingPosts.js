import React from 'react'
import * as _ from 'lodash'
import {Button, Card} from 'element-react'
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

      <Card className="box-card sectionCard" header={
        <div className="headline">
            <h3>Входящие обжалования</h3>
        </div>
      }>
      <div className="form-container w600">
        <div className="search">
          <div className="wrap wrap--compact">
            <div className="item item--full mb6">
                <small className="label">Номер в ЭДО</small>
                <div className="value">
                  <input type='text' value={edo} onChange={(e)=>this.setter('edo',e.target.value)} />
                </div>
            </div>
          </div>
        </div>

        <div className="search-result">
          <div className="flex-table pl0">
            {posts.map((x,i)=>(
              <div className="row">
                <div className="column">
                  <div className="label">№ постановления</div>
                  <div className="value w300">
                    <input type='text' className="w-full" value={x.num}  onChange={(e)=>this.setterPosts(i,'num',e.target.value)} />
                  </div>
                </div>
                <div className="column">
                  <div className="label">Дата</div>
                  <div className="value w130">
                    <EPicker value={x.date} onChange={(x)=>this.setterPosts(i,'date',x)} date='+' />
                  </div>
                </div>
                <div className="column column--end">
                  <div className="value">
                    <Button className="py0" size="small" type="text" onClick={()=>this.removePost(i)}>
                        <i className="ico round minus"/>
                    </Button>
                    <Button className="py0" size="small" type="text" onClick={this.addPost}>
                        <i className="ico round plus"/>
                    </Button>
                  </div>
                </div>
              </div>)
            )}
          </div>
        </div>
        <div className="mt18">
          {!posts.length 
            ? <div>
                <p className="my6 txt-em color-gray align-center">Нет добавленных обжалований</p>
                <Button size="small" icon="plus"  className="flex-parent mx-auto my6 block" onClick={this.addPost}>Добавить</Button>
              </div>
            : <div>
                <Button size="small" className="flex-parent mx-auto my6 block" onClick={this.save}>Сохранить</Button>
              </div>
          }
        </div>

       
      </div>

    </Card>



  








        // <div>
        //   <table>
        //     <tbody>
        //       <tr>
        //         <td colSpan='2'>N постановления</td>
        //         <td>Дата</td>
        //       </tr>
              
        //       {posts.map((x,i)=>(
        //           <tr>
        //           <td><Button onClick={()=>this.removePost(i)} >-</Button></td>
        //             <td><input type='text' value={x.num}  onChange={(e)=>this.setterPosts(i,'num',e.target.value)} /></td>
        //             <td><EPicker value={x.date} onChange={(x)=>this.setterPosts(i,'date',x)} date='+' /></td>
        //           </tr>)
        //       )}
        //     </tbody>
        //   </table>

        //   <table>
        //     <tbody>
        //       <tr>
        //         <td><Button onClick={this.addPost}>+</Button></td>
        //         <td colSpan='2' ><Button onClick={this.save} >Сохранить</Button></td>
        //       </tr>
        //     </tbody>
        //   </table>
        // </div>

    );
  }
}