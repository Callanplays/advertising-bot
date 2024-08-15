           if (!this.advertising) {
                console.log(`[${this.bot.username}] /visit Menu (probably) Window Opening detected, clicking it.`);
                this.bot.simpleClick.leftMouse(window.slots.filter((n) => n)[this.settings.autoVisitSlot - 1].slot, 1, 0);
        } else {