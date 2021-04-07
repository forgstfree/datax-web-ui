import Button from "./button"

const components = [
    Button
]

const install = (Vue)=>{
    for(var key in components){
        Vue.components(components[key].name,components[key])
    }
}

export default{
    install,
    Button
}