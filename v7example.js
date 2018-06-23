export class Comp extends Component {
  constructor() {
    this.myUnityContent = new UnityContent(
      "Public/Build/myGame.json",
      "Public/Build/UnityLoader.js"
      // options
    );

    // Settings fullscreen
    this.myUnityContent.setFullscreen(true);

    // Emits an even to Unity
    this.myUnityContent.send("EnemyController", "SpawnEnemies", 100);
    this.myUnityContent.send("EnemyController", "LogOut");

    // When unity emits an event to React
    this.myUnityContent.on("spawnedEnemy", count => {
      console.log("spawned enemies", count);
    });

    // Build in events
    this.myUnityContent.on("progress", progression => {
      console.log("loaded", progression);
    });

    this.myUnityContent.on("ready", () => {});
    this.myUnityContent.on("willLoad", () => {});
    this.myUnityContent.on("didLoad", () => {});
    this.myUnityContent.on("willUnload", () => {});
    this.myUnityContent.on("didUnload", () => {});
  }
  render() {
    <Unity
      content={this.myUnityContent}
      width="100px"
      height="100px"
      className="myGame"
    />;
  }
}
