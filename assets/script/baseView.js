// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    m_hero: {
      type: cc.Sprite,
      default: null
    },
    m_button: {
      type: cc.Button,
      default: null
    },
    bg: {
      type: cc.Node,
      default: null
    }
  },

  onLoad() {
    cc.log(this.m_button.node.getPosition());
    cc.debug.setDisplayStats(false);
    this.animCtrl = this.m_hero.getComponent(cc.Animation);
    this.animCtrl.play('run');
    this.m_button.node.on(
      cc.Node.EventType.TOUCH_START,
      this.onButtonRoll.bind(this, false),
      this
    );
    this.m_button.node.on(
      cc.Node.EventType.TOUCH_END,
      this.stopOnButtonRoll.bind(this),
      this
    );
    this.m_button.node.on(
      cc.Node.EventType.TOUCH_CANCEL,
      this.stopOnButtonRoll.bind(this),
      this
    );
    this.bgRun();
    this.initData();
  },
  initData() {
    this.disHeight = 20;
    this.heroWidget = this.m_hero.node.getComponent(cc.Widget);
    // 立即对齐widget
    this.heroWidget.updateAlignment();
    cc.log(this.heroWidget);
    this.heroInitP = cc.v2(this.heroWidget.node.x, this.heroWidget.node.y);
    cc.log(this.heroInitP);
  },
  bgRun() {
    var y = this.bg.y;
    var x = this.bg.x - 500;
    let moveleft = cc.moveTo(5, cc.v2(x, y));
    this.bg.runAction(moveleft);
  },
  getAniClip() {
    return this.animCtrl.currentClip.name;
  },
  // 人物跳起
  onButtonJump(target, data) {
    if (data == 'jump') {
      if (this.getAniClip() != 'run') return;
      var x = this.heroInitP.x;
      var y = this.heroInitP.y;
      var moveT = cc
        .moveTo(0.5, cc.v2(x, y + 120))
        .easing(cc.easeCubicActionOut());
      var moveT1 = cc.moveTo(0.5, x, y).easing(cc.easeCubicActionIn());
      this.animCtrl.play('jump');
      var callBack = cc.callFunc(this.run.bind(this));
      var action = cc.sequence(moveT, moveT1, callBack);
      this.m_hero.node.runAction(action);
    }
  },
  run() {
    this.animCtrl.play('run');
  },
  heroPosition(reset) {
    if (reset) {
      this.m_hero.node.setPosition(this.heroInitP);
      return this.heroInitP;
    } else {
      this.m_hero.node.setPosition(
        this.heroInitP.x,
        this.heroInitP.y - this.disHeight
      );
      return cc.v2(this.heroInitP.x, this.heroInitP.y - this.disHeight);
    }
  },
  //   人物滑铲
  onButtonRoll(down) {
    if (this.getAniClip() != 'run') return;
    cc.log(this.getAniClip());
    this.heroPosition(down);
    this.animCtrl.play('roll');
  },
  stopOnButtonRoll() {
    if (this.getAniClip() != 'roll') return;
    this.animCtrl.play('run');
    this.heroPosition(true);
  }
  // update (dt) {},
});
