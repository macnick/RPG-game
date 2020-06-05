(function (f) { if (typeof exports === 'object' && typeof module !== 'undefined') { module.exports = f(); } else if (typeof define === 'function' && define.amd) { define([], f); } else { let g; if (typeof window !== 'undefined') { g = window; } else if (typeof global !== 'undefined') { g = global; } else if (typeof self !== 'undefined') { g = self; } else { g = this; } g.PhaserHealth = f(); } }(() => {
  let define; let module; let
    exports; return (function () { function r(e, n, t) { function o(i, f) { if (!n[i]) { if (!e[i]) { const c = typeof require === 'function' && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); const a = new Error(`Cannot find module '${i}'`); throw a.code = 'MODULE_NOT_FOUND', a; } const p = n[i] = { exports: {} }; e[i][0].call(p.exports, (r) => { const n = e[i][1][r]; return o(n || r); }, p, p.exports, r, e, n, t); } return n[i].exports; } for (var u = typeof require === 'function' && require, i = 0; i < t.length; i++)o(t[i]); return o; } return r; }())({
      1: [function (require, module, exports) {
        const HEALTH = 'health';
        const MAX_HEALTH = 'maxHealth';
        const DAMAGE = 'damage';
        const HEAL = 'heal';
        const HEALTH_CHANGE = 'healthchange';
        const DIE = 'die';
        const REVIVE = 'revive';

        const { Each } = Phaser.Utils.Array;

        const dumpMap = function (obj) {
          return {
            name: obj.name,
            alive: obj.isAlive(),
            health: obj.getHealth(),
            maxHealth: obj.getMaxHealth(),
          };
        };

        var Health = {

          AddTo(obj, health, maxHealth) {
            Object.assign(obj, Health.HealthComponent);

            Health.SetHealth(obj, health || 1, maxHealth || 100, true);

            return obj;
          },

          Damage(obj, amount, silent) {
            return obj.damage(amount, silent);
          },

          Dump(objs) {
            console.table(objs.map(dumpMap));
          },

          Heal(obj, amount, silent) {
            return obj.heal(amount, silent);
          },

          IsAlive(obj) {
            return obj.isAlive();
          },

          IsDead(obj) {
            return obj.isDead();
          },

          Kill(obj, silent) {
            return obj.kill(silent);
          },

          MixinTo(obj) {
            return Object.assign(obj.prototype, Health.HealthComponent);
          },

          Revive(obj, health, silent) {
            return obj.revive(health, silent);
          },

          ReviveAtMaxHealth(obj, silent) {
            return obj.reviveAtMaxHealth(silent);
          },

          SetHealth(obj, health, maxHealth, silent) {
            if (maxHealth) obj.setMaxHealth(maxHealth);

            return obj.setHealth(health, silent);
          },

          Actions: {

            Damage(objs, amount, silent) {
              Each(objs, Health.Damage, null, amount, silent);

              return objs;
            },

            Heal(objs, amount, silent) {
              Each(objs, Health.Heal, null, amount, silent);

              return objs;
            },

            Kill(objs, silent) {
              Each(objs, Health.Kill, null, silent);

              return objs;
            },

            Revive(objs, health, silent) {
              Each(objs, Health.Revive, null, health, silent);

              return objs;
            },

            ReviveAtMaxHealth(objs, silent) {
              Each(objs, Health.ReviveAtMaxHealth, null, silent);

              return objs;
            },

            SetHealth(objs, health, maxHealth, silent) {
              Each(objs, Health.SetHealth, null, health, maxHealth, silent);

              return objs;
            },

          },

          Events: {
            DAMAGE,

            DIE,

            HEAL,

            HEALTH_CHANGE,

            REVIVE,
          },

          HealthComponent: {

            getHealth() {
              return this.getData(HEALTH);
            },

            getHealthFrac() {
              return this.getHealth() / this.getMaxHealth();
            },

            getMaxHealth() {
              return this.getData(MAX_HEALTH);
            },

            setHealth(health, silent) {
              const maxHealth = this.getMaxHealth();
              const prevHealth = this.getHealth();
              const newHealth = Math.min(health, maxHealth);
              const change = newHealth - prevHealth;

              if (change === 0) return this;

              this.setData(HEALTH, newHealth);

              if (silent) return this;

              this.emit(HEALTH_CHANGE, this, change, newHealth, maxHealth);

              if (prevHealth > 0 && newHealth <= 0) {
                this.emit(DIE, this);
              } else if (prevHealth <= 0 && newHealth > 0) {
                this.emit(REVIVE, this);
              }

              return this;
            },

            setMaxHealth(amount, silent) {
              this.setData(MAX_HEALTH, amount);

              if (this.getHealth() > amount) {
                this.setHealth(amount, silent);
              }

              return this;
            },

            damage(amount, silent) {
              if (amount === 0) return this;

              if (!amount) amount = 1;

              if (!silent) {
                this.emit(DAMAGE, this, amount);
              }

              this.setHealth(this.getHealth() - amount, silent);

              return this;
            },

            heal(amount, silent) {
              if (amount === 0) return this;

              if (!amount) amount = 1;

              if (!silent) {
                this.emit(HEAL, this, amount);
              }

              this.setHealth(this.getHealth() + amount, silent);

              return this;
            },

            isAlive() {
              return this.getHealth() > 0;
            },

            isDead() {
              return this.getHealth() <= 0;
            },

            kill(silent) {
              if (this.isAlive()) {
                this.setHealth(0, silent);
              }

              return this;
            },

            revive(health, silent) {
              if (this.isDead()) {
                this.setHealth(health || 1, silent);
              }

              return this;
            },

            reviveAtMaxHealth(silent) {
              this.revive(this.getMaxHealth(), silent);

              return this;
            },

          },

        };

        module.exports = Health;
      }, {}],
    }, {}, [1])(1);
}));
