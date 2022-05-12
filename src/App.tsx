import { useEffect, useState } from 'react';
import * as C from './App.styles'
import logoImage from './assets/devmemory_logo.png';
import { InfoItem } from './components/InfoItem';
import { Button } from './components/InfoItem/Button';
import RestartIcon from './svgs/restart.svg';
import { GridItemType } from './types/GridItemType';
import { items } from './data/items'
import { GridItem } from './components/GridItem';

const App = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [shownCount, setShownCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);

  useEffect(()=>{
    resetAndCreateGrid();
  },[]);
  
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

  }
  
  return (
    <C.Container>
      <C.Info>
        <C.LogoLink href="">
          <img src={logoImage} width="200" alt=''/>
        </C.LogoLink>

        <C.InfoArea>
          <InfoItem label='Tempo' value='00:00'/>
          <InfoItem label='Movimentos' value='0'/>
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