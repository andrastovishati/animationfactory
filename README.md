# animationfactory
Animation Factory is a lightweight javascript animation engine.

##Usage

```javascript
AF.create('myFirstAnimation', {
  object:myObj,
  duration:1200,
  delay:200,
  easing:'BackIn',
  timeline:[{
    to:{x:2},
    easing:'BounceOut'
  },{
    to:{x:2, z:1},
    easing:'BounceIn'
  }]
});
```
