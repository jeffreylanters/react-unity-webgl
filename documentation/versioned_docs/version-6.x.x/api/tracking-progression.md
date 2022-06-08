# Tracking progression

The loading progression of the Unity player will be a value between 0 and 1

```js
<Unity ... onProgress={ this.onProgress } />
onProgress (progression) {
  console.log (`Loading ${(progression * 100)} % ...`)
  if (progression === 1)
    console.log (`Loading done!`)
}
```
