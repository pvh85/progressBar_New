class barWindow {
  //url - адрес куда шлем запросы, на получение данных для баров
  //id - id диалога
  constructor(id, url) {
    this.id = id
    this.url = url
    this.bars = []
    this.dialogButtons = [{
        text: "Cancel",
        click: this.close.bind(this)
      },
      {
        text: "AddBar",
        click: () => {
          this.addBar({
            idItem: this.bars.length + 1,
            position: Math.random(100) * 100,
            count: 100,
            progressText: `autobar:${this.bars.length+1}`
          })
        },
      },
      {
        text: "RemoveBar",
        click: this.removeBar.bind(this)
      },
      {
        text: "GetByUrl",
        click: () => {
          if (!this.dataLoop) {
            this.getData()
            this.dataLoop = setInterval(this.getData.bind(this), 1000);
          }
        }
      }
    ];
    this.dialogDiv = $(`<div id = ${id} class = "div-300"></div>`);
  }

  //Получаем данные и рисуем бары
  async getData() {
    console.log('tick')
    try {
      let response = await fetch(this.url)
      if (response.ok) {
        let data = await response.json();
        data.progresses.map(elem => {
          if (this.bars.length == 0) {
            this.addBar(elem)
          } else {
            let barIndex = null
            /*
              Проверяет существование бара
              возможно можно красивее, подумать.
            */
            for (let i = 0; i < this.bars.length; i++) {
              if (elem.idItem == this.bars[i].obj.id) {
                barIndex = i;
                break;
              } else {
                barIndex = null;
              }
            }
            barIndex != null ? this.bars[barIndex].obj.setValue(elem.position) : this.addBar(elem)
          }
        })
      } else {
        throw ('bad response ' + response.status)
      }
    } catch (exception) {
      alert(`fail while get data url: ${this.url} 
           error: ${exception}`)
    }
    /* старое
    fetch(this.url)
      .then((response) => {
        if (response.status == 200){
          return response.json(); 
        } 
        else {
          throw `not valid response. Status:${response.status}`
        }
      })
      .then((data) => {
      })
     .catch( (error) => {
       alert(error)
     })
     */

  }

  //Вычищает все блоки и интервал
  close() {
    this.dialogBlock.dialog("destroy");
    this.dialogBlock.remove();
    this.bars.map(elem => {
      elem.block.map(block => block.remove())
    });
    clearInterval(this.dataLoop);
    this.bars = []
  }

  //рисует диалог 
  // является дочкой элемента который указали на вход
  open(elem) {
    this.parent = elem;
    this.parent.append(this.dialogDiv)
    this.dialogBlock = $("#" + this.id)
    this.dialogBlock.dialog({
        position: {
          // my: 'left top',
          // at: 'left',
          of: $('#' + this.parent.attr('id'))
        },
        modal: false,
        autoOpen: false,
        buttons: this.dialogButtons,
        appendTo: '#' + this.parent.attr('id')
      })
      .parent().draggable({
        containment: '#' + this.parent.attr('id')
      });

    this.dialogBlock.dialog("open");
  }

  //возвращает jq блок диалога
  getElem() {
    return this.dialogBlock
  }

  //добавляет бар в диалог
  addBar(barData) {
    const bar = new ProgressBar(this.dialogBlock, barData)
    this.bars.push({
      "obj": bar.getObj(),
      "block": bar.getBlock()
    })
    bar.open();
  }

  // удаляем последний бар из диалога 
  // легко модифицируется для удаления конкретного бара
  removeBar(barData) {
    if (this.bars.length > 0) {
      this.bars[this.bars.length - 1].block.map(block => {
        block.remove()
      });
      this.bars.pop()
    }
  }

}



class ProgressBar {
  constructor(parent, {
    idItem,
    ...barData
  }) {
    this.parent = parent
    this.id = idItem
    this.data = barData
    this.barText = $(`<div id ="bar${idItem}_label">${barData.progressText}</div>`)
    this.barBlock = $(`<div id = "bar${idItem}_progress"></div>`);
  }

  //рисует бар
  open() {
    this.parent.append(this.barText)
    this.parent.append(this.barBlock)
    this.barBlock.progressbar({
      classes: {
        "ui-progressbar": "ui-corner-all",
        "ui-progressbar-complete": "ui-corner-right",
        "ui-progressbar-value": "ui-corner-left"
      },
      max: this.data.count,
      value: this.data.position
    })
    this.updateValueText();
  }

  //выставляет значение бара
  setValue(value) {
    this.barBlock.progressbar("value", value);
    this.updateValueText();
  }

  //обновление текста прогресса
  updateValueText() {
    const newVal = Math.floor(this.barBlock.progressbar("option", "value"))
    this.barBlock
      .children('.ui-progressbar-value')
      .html(`<span class='value-text'> ${newVal + '%'} </span>`)
      .css("display", "block");
  }


  //возвращает jq блок
  getBlock() {
    return [this.barBlock, this.barText]
  }

  //возвращает объект
  getObj() {
    return this
  }
}