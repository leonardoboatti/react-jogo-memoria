import { useEffect, useState } from 'react';
import * as C from './App.styles'
import logoImage from './assets/devmemory_logo.png';
import { InfoItem } from './components/InfoItem';
import { Button } from './components/InfoItem/Button';
import RestartIcon from './svgs/restart.svg';
import { GridItemType } from './types/GridItemType';
import { items } from './data/items'
import { GridItem } from './components/GridItem';
import { formatTimeElapsed } from './helpers/formatTimeElapsed';

const App = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [shownCount, setShownCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);

  useEffect(()=>{
    resetAndCreateGrid();
  },[]);

  useEffect(()=>{
    const timer = setInterval(() => {
      if(playing){
        setTimeElapsed(timeElapsed + 1)
      }
    }, 1000);
    return () => clearInterval(timer);
  },[playing, timeElapsed]);

  //verificar se os abertos sao iguais
  useEffect(() => {
    if(shownCount === 2){
      let opened = gridItems.filter(item => item.shown === true);
      if(opened.length === 2){
        
        //se eles sao iguais = exibe o tempo todo 
        if(opened[0].item === opened[1].item){          
          let tmpGrid = [...gridItems];
            for(let i in tmpGrid){
              if(tmpGrid[i].shown){
                tmpGrid[i].permanentShown = true;
                tmpGrid[i].shown = false;
              }
            }            
            setGridItems(tmpGrid);
            setShownCount(0);  
        }else{
          //se nao for igual = fecha   
          setTimeout(()=> {
            let tmpGrid = [...gridItems];       
            for(let i in tmpGrid){
              tmpGrid[i].shown = false;
            }  
            setGridItems(tmpGrid);
            setShownCount(0); 
          }, 1000);       
        }

        setMoveCount(moveCount => moveCount + 1);
      }
    }
  }, [shownCount, gridItems]);

  //verificar se o jogo terminou
  useEffect(()=>{
    if(moveCount > 0 && gridItems.every(item => item.permanentShown === true)){
      setPlaying(false);
    }
  }, [moveCount, gridItems]);
  
  const resetAndCreateGrid =()=>{
    // resetar o jogo
    setTimeElapsed(0);    
    setMoveCount(0);
    setShownCount(0);    

    //criar o grid 
    //criar um grid vazio
    let tmpGrid: GridItemType[] = [];
    for(let i = 0; i < (items.length * 2); i++){
      tmpGrid.push({
        item: null,
        shown: false,
        permanentShown:false
      });
    }

    //preencher o grid
    for(let w = 0; w < 2; w++){
      for(let i = 0; i < items.length; i++){
        let pos = -1;//tenho que começar com um numero que nao tem no meu grid. Ex..: se comecar com 1, esse numero ja tem no meu grid
        while(pos < 0 || tmpGrid[pos].item !== null){ //vou gerando posicoes que nao estao preenchidas. Ex..: gerou o num 2, ele vai vericar se ja tem o 2, se tiver o 2 gera outro se nao tiver sai do WHILE(assim eu tenho certeza que vai preencher todas as posicoes do grid q nesse caso sao 12)
          pos = Math.floor(Math.random() * (items.length * 2)); //gerando um numero aleatorio ate a quantidade de items(imgs) que tem        
        }
        tmpGrid[pos].item = i; //preenchendo a posicao
      }
    }

    //jogar no state
    setGridItems(tmpGrid);

    //comecar o jogo
    setPlaying(true);
  }

  const handleItemClick = (index: number) => {
    if(playing && index !== null && shownCount < 2){
      let  tmpGrid = [...gridItems];

      if(tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false){
        tmpGrid[index].shown = true;
        setShownCount(shownCount + 1);
      }

      setGridItems(tmpGrid);
    }
  }
  
  return (
    <C.Container>
      <C.Info>
        
        <C.TitleInfo>Jogo da Memória</C.TitleInfo>

        <C.InfoArea>
          <InfoItem label='Tempo' value={formatTimeElapsed(timeElapsed)}/>
          <InfoItem label='Movimentos' value={moveCount.toString()}/>
        </C.InfoArea>

        <Button label='Reiniciar' icon={RestartIcon} onClick={resetAndCreateGrid}/>
      </C.Info>
      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index)=>(
          <GridItem
            key={index}
            item={item}
            onClick={() => handleItemClick(index)}
          />
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>
  );
}

export default App;