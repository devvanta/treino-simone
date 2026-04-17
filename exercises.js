// exercises.js — Banco de dados completo de exercicios para Simone Trombini
// YouTube video IDs for senior-appropriate exercise demonstrations

const EXERCISE_DB = {
  1: {
    dayName: 'Peito + Triceps',
    dayLabel: 'Segunda-feira',
    icon: '💪',
    gradient: 'grad-primary',
    exercises: [
      {
        id: 'd1e1',
        name: 'Flexao na Parede',
        muscleGroup: 'Peito',
        muscleEmoji: '🫁',
        sets: 3,
        reps: 12,
        isometric: false,
        equipment: 'Parede lisa',
        youtubeId: 'a6YHbXD2XlU',
        startPosition: 'Fique de pe, a cerca de um braco de distancia da parede. Coloque as maos na parede na altura dos ombros, um pouco mais afastadas que a largura dos ombros. Pes juntos ou levemente afastados.',
        execution: '1. Flexione os cotovelos e leve o peito em direcao a parede, mantendo o corpo reto como uma tabua.\n2. Toque levemente o nariz ou o queixo na parede.\n3. Empurre a parede para voltar a posicao inicial.\n4. Mantenha o abdomen contraido durante todo o movimento.',
        breathing: 'Inspire ao descer em direcao a parede. Expire ao empurrar e voltar.',
        caution: 'Mantenha os punhos alinhados — nao deixe as maos muito baixas para nao forcar os ombros. Se sentir desconforto no pescoco, afaste os pes um pouco mais da parede para reduzir a carga.'
      },
      {
        id: 'd1e2',
        name: 'Supino no Chao com Garrafas',
        muscleGroup: 'Peito',
        muscleEmoji: '🫁',
        sets: 3,
        reps: 12,
        isometric: false,
        equipment: '2 garrafas (500ml ou 1L)',
        youtubeId: '8sLMraEN3HM',
        startPosition: 'Deite-se de costas no chao (use um tapete ou colchonete). Joelhos dobrados, pes apoiados no chao. Segure uma garrafa em cada mao com as palmas viradas para frente, cotovelos no chao formando um "T" com o corpo.',
        execution: '1. Empurre as garrafas para cima ate os bracos ficarem quase esticados (nao trave os cotovelos).\n2. Segure por 1 segundo no topo.\n3. Desca lentamente ate os cotovelos tocarem o chao.\n4. Repita sem pressa.',
        breathing: 'Expire ao empurrar para cima. Inspire ao descer.',
        caution: 'Nao trave os cotovelos no topo. Apoie bem a cabeca no chao — se o pescoco incomodar, coloque uma toalha dobrada sob a nuca.'
      },
      {
        id: 'd1e3',
        name: 'Crucifixo no Chao com Garrafas',
        muscleGroup: 'Peito',
        muscleEmoji: '🫁',
        sets: 2,
        reps: 12,
        isometric: false,
        equipment: '2 garrafas (500ml ou 1L)',
        youtubeId: 'QENKPHhQVi4',
        startPosition: 'Mesma posicao do supino: deitada de costas, joelhos dobrados. Segure as garrafas com bracos estendidos acima do peito, palmas se olhando.',
        execution: '1. Abra os bracos para os lados em arco, como se fosse abracar uma bola grande.\n2. Desca ate os cotovelos quase tocarem o chao (leve flexao nos cotovelos).\n3. Volte ao centro apertando o peito.\n4. Movimento lento e controlado.',
        breathing: 'Inspire ao abrir os bracos. Expire ao fechar.',
        caution: 'Nao desca demais — pare quando sentir um leve alongamento no peito. Mantenha uma leve flexao nos cotovelos para proteger a articulacao.'
      },
      {
        id: 'd1e4',
        name: 'Triceps na Cadeira',
        muscleGroup: 'Triceps',
        muscleEmoji: '💪',
        sets: 3,
        reps: 10,
        isometric: false,
        equipment: 'Cadeira firme (sem rodinhas)',
        youtubeId: 'HCf97NPYeGY',
        startPosition: 'Sente-se na beira de uma cadeira firme. Coloque as maos na borda da cadeira ao lado do quadril, dedos para frente. Deslize o quadril para fora da cadeira, pernas dobradas a 90°.',
        execution: '1. Flexione os cotovelos e desca o quadril em direcao ao chao.\n2. Desca ate os cotovelos formarem cerca de 90° (nao precisa ir mais fundo).\n3. Empurre para cima ate os bracos ficarem quase esticados.\n4. Mantenha as costas proximas a cadeira.',
        breathing: 'Inspire ao descer. Expire ao empurrar para cima.',
        caution: 'Nao desca demais para nao sobrecarregar os ombros. Certifique-se que a cadeira esta firme e nao vai escorregar. Se o joelho direito incomodar, estenda a perna direita para reduzir a pressao.'
      },
      {
        id: 'd1e5',
        name: 'Extensao de Triceps com Garrafa',
        muscleGroup: 'Triceps',
        muscleEmoji: '💪',
        sets: 2,
        reps: 12,
        isometric: false,
        equipment: '1 garrafa (1L)',
        youtubeId: 'nRiJVZDpdL0',
        startPosition: 'Sentada ou em pe. Segure uma garrafa com uma mao, eleve o braco acima da cabeca com o cotovelo apontando para o teto.',
        execution: '1. Flexione o cotovelo, descendo a garrafa atras da cabeca.\n2. Mantenha o cotovelo apontando para cima (nao deixe abrir para o lado).\n3. Estenda o braco de volta para cima.\n4. Faca todas as reps de um lado, depois troque.',
        breathing: 'Inspire ao descer a garrafa. Expire ao estender o braco.',
        caution: 'Faca devagar para nao forcar a cervical. Se sentir dor no pescoco, use a outra mao para apoiar o cotovelo do braco que esta trabalhando. Use garrafa leve.'
      }
    ]
  },
  2: {
    dayName: 'Gluteos + Posteriores',
    dayLabel: 'Terca-feira',
    icon: '🍑',
    gradient: 'grad-secondary',
    exercises: [
      {
        id: 'd2e1',
        name: 'Elevacao de Quadril (Ponte)',
        muscleGroup: 'Gluteos',
        muscleEmoji: '🍑',
        sets: 3,
        reps: 15,
        isometric: false,
        equipment: 'Tapete ou colchonete',
        youtubeId: 'OUgsJ8-Vi0E',
        startPosition: 'Deite de costas no chao, joelhos dobrados, pes apoiados no chao na largura do quadril. Bracos ao lado do corpo, palmas para baixo.',
        execution: '1. Aperte os gluteos e eleve o quadril do chao ate o corpo formar uma linha reta dos ombros aos joelhos.\n2. Segure no topo por 2 segundos, apertando bem os gluteos.\n3. Desca lentamente ate quase encostar o quadril no chao.\n4. Repita sem apoiar completamente.',
        breathing: 'Expire ao elevar o quadril. Inspire ao descer.',
        caution: 'Nao hiperestenda a lombar no topo — suba apenas ate ficar reto. Mantenha os pes bem apoiados. Se o joelho direito doer, afaste os pes um pouco mais do corpo.'
      },
      {
        id: 'd2e2',
        name: 'Abducao de Quadril Deitada',
        muscleGroup: 'Gluteos',
        muscleEmoji: '🍑',
        sets: 3,
        reps: 12,
        isometric: false,
        equipment: 'Tapete ou colchonete',
        youtubeId: 'jghbMRIaL8I',
        startPosition: 'Deite-se de lado, pernas esticadas e empilhadas. Apoie a cabeca no braco de baixo. Mao de cima na frente do corpo para equilibrio.',
        execution: '1. Eleve a perna de cima lentamente, mantendo-a esticada.\n2. Suba ate cerca de 45° (nao precisa ir alto demais).\n3. Desca lentamente sem encostar na outra perna.\n4. Faca todas as reps e vire para o outro lado.',
        breathing: 'Expire ao elevar a perna. Inspire ao descer.',
        caution: 'Nao gire o quadril para tras. Mantenha o corpo bem alinhado. Se o joelho direito incomodar ao deitar sobre ele, coloque um travesseiro entre as pernas.'
      },
      {
        id: 'd2e3',
        name: 'Extensao de Quadril (Quatro Apoios)',
        muscleGroup: 'Gluteos / Posteriores',
        muscleEmoji: '🍑',
        sets: 3,
        reps: 12,
        isometric: false,
        equipment: 'Tapete ou colchonete',
        youtubeId: 'AjnR2AUG9e8',
        startPosition: 'Posicao de quatro apoios: maos sob os ombros, joelhos sob o quadril. Costas retas (como uma mesa).',
        execution: '1. Mantenha o joelho dobrado a 90° e empurre o pe em direcao ao teto.\n2. Suba ate a coxa ficar alinhada com as costas.\n3. Segure 1 segundo no topo, apertando o gluteo.\n4. Desca devagar e repita. Troque de perna.',
        breathing: 'Expire ao elevar a perna. Inspire ao descer.',
        caution: 'Coloque um travesseiro ou toalha dobrada sob o joelho direito para amortecer. Se doer, faca o exercicio em pe, segurando numa cadeira, chutando a perna para tras.'
      },
      {
        id: 'd2e4',
        name: 'Stiff Modificado com Garrafas',
        muscleGroup: 'Posteriores de coxa',
        muscleEmoji: '🦵',
        sets: 3,
        reps: 12,
        isometric: false,
        equipment: '2 garrafas (1L)',
        youtubeId: 'CN_7cz3P-1U',
        startPosition: 'Em pe, pes na largura do quadril. Segure uma garrafa em cada mao na frente das coxas. Joelhos levemente flexionados.',
        execution: '1. Incline o tronco para frente, empurrando o quadril para tras (como se fosse fechar uma porta com o bumbum).\n2. Deslize as garrafas pelas coxas ate a altura dos joelhos.\n3. Sinta o alongamento na parte de tras das coxas.\n4. Volte a posicao inicial apertando os gluteos.',
        breathing: 'Inspire ao descer. Expire ao subir.',
        caution: 'Mantenha as costas RETAS — nunca arredonde. Nao desca alem dos joelhos. Flexione levemente os joelhos para proteger a articulacao. Se a cervical incomodar, olhe para o chao (nao force o pescoco para cima).'
      },
      {
        id: 'd2e5',
        name: 'Ponte Unilateral (Avancado)',
        muscleGroup: 'Gluteos',
        muscleEmoji: '🍑',
        sets: 2,
        reps: 10,
        isometric: false,
        equipment: 'Tapete ou colchonete',
        youtubeId: 'AVAXhy1pl7o',
        startPosition: 'Mesma posicao da ponte normal. Estenda uma perna para cima (ou mantenha elevada com joelho dobrado se for mais facil).',
        execution: '1. Com uma perna apoiada e a outra elevada, eleve o quadril.\n2. Suba ate o corpo ficar reto.\n3. Segure 2 segundos no topo.\n4. Desca devagar. Faca todas as reps e troque de perna.',
        breathing: 'Expire ao subir. Inspire ao descer.',
        caution: 'Se for muito dificil, volte para a ponte com as duas pernas. Comece sempre pela perna mais forte (esquerda) para aquecer. Ao fazer com a perna direita apoiada, preste atencao ao joelho — pare se sentir dor.'
      }
    ]
  },
  3: {
    dayName: 'Costas + Biceps',
    dayLabel: 'Quarta-feira',
    icon: '🏋️',
    gradient: 'grad-success',
    exercises: [
      {
        id: 'd3e1',
        name: 'Remada Curvada com Garrafas',
        muscleGroup: 'Costas',
        muscleEmoji: '🔙',
        sets: 3,
        reps: 12,
        isometric: false,
        equipment: '2 garrafas (1L)',
        youtubeId: 'roCP6wCXPqo',
        startPosition: 'Em pe, pes na largura do quadril. Incline o tronco para frente (~45°), joelhos levemente dobrados. Bracos esticados para baixo segurando as garrafas.',
        execution: '1. Puxe as garrafas em direcao ao umbigo, apertando as escapulas (como se quisesse segurar um lapis entre elas).\n2. Segure 1 segundo no topo.\n3. Desca lentamente.\n4. Mantenha as costas retas o tempo todo.',
        breathing: 'Expire ao puxar. Inspire ao descer.',
        caution: 'Nao arredonde as costas. Olhe para o chao a sua frente para nao forcar a cervical. Se a lombar doer, apoie uma mao numa cadeira e faca unilateral.'
      },
      {
        id: 'd3e2',
        name: 'Remada Unilateral na Cadeira',
        muscleGroup: 'Costas',
        muscleEmoji: '🔙',
        sets: 3,
        reps: 12,
        isometric: false,
        equipment: '1 garrafa (1L) + cadeira',
        youtubeId: 'dFzUjzfih7k',
        startPosition: 'Apoie o joelho esquerdo e a mao esquerda numa cadeira. Perna direita esticada atras, apoiada no chao. Segure a garrafa com a mao direita, braco esticado para baixo.',
        execution: '1. Puxe a garrafa em direcao ao quadril, cotovelo rente ao corpo.\n2. Aperte as costas no topo por 1 segundo.\n3. Desca lentamente.\n4. Faca todas as reps e troque de lado.',
        breathing: 'Expire ao puxar. Inspire ao descer.',
        caution: 'Mantenha as costas retas e paralelas ao chao. Se apoiar o joelho direito na cadeira causar dor, faca em pe com apoio de uma mao na parede.'
      },
      {
        id: 'd3e3',
        name: 'Puxada com Toalha',
        muscleGroup: 'Costas',
        muscleEmoji: '🔙',
        sets: 3,
        reps: 12,
        isometric: false,
        equipment: 'Toalha grande',
        youtubeId: 'Y3ntNsIS2Q8',
        startPosition: 'Sentada numa cadeira, segure uma toalha esticada acima da cabeca com as duas maos, mais aberta que os ombros.',
        execution: '1. Puxe a toalha para baixo, levando-a atras da cabeca em direcao a nuca.\n2. Aperte as escapulas ao maximo.\n3. Mantenha 1 segundo embaixo.\n4. Volte lentamente para cima.\n5. Mantenha tensao na toalha o tempo todo (puxando para fora).',
        breathing: 'Expire ao puxar para baixo. Inspire ao subir.',
        caution: 'Cuidado com a cervical! Nao force a toalha contra o pescoco. Se doer, faca o movimento apenas ate a altura das orelhas, sem ir atras da cabeca.'
      },
      {
        id: 'd3e4',
        name: 'Rosca Biceps com Garrafas',
        muscleGroup: 'Biceps',
        muscleEmoji: '💪',
        sets: 3,
        reps: 12,
        isometric: false,
        equipment: '2 garrafas (500ml ou 1L)',
        youtubeId: 'soxrZlIl35U',
        startPosition: 'Em pe ou sentada, bracos ao lado do corpo, segurando uma garrafa em cada mao com palmas viradas para frente.',
        execution: '1. Flexione os cotovelos, subindo as garrafas em direcao aos ombros.\n2. Mantenha os cotovelos colados ao corpo (nao deixe balancar).\n3. Segure 1 segundo no topo.\n4. Desca lentamente.',
        breathing: 'Expire ao subir. Inspire ao descer.',
        caution: 'Nao balance o corpo para ajudar. Se os punhos doerem, segure as garrafas com as palmas viradas para dentro (rosca martelo). Faca sentada se sentir tontura.'
      },
      {
        id: 'd3e5',
        name: 'Rosca Martelo com Garrafas',
        muscleGroup: 'Biceps / Antebraco',
        muscleEmoji: '💪',
        sets: 2,
        reps: 12,
        isometric: false,
        equipment: '2 garrafas (500ml ou 1L)',
        youtubeId: 'TwD-YGVP4Bk',
        startPosition: 'Em pe ou sentada, bracos ao lado do corpo, segurando as garrafas com palmas viradas uma para a outra (como segurar um martelo).',
        execution: '1. Flexione os cotovelos, subindo as garrafas mantendo as palmas viradas para dentro.\n2. Suba ate os ombros.\n3. Segure 1 segundo.\n4. Desca lentamente.',
        breathing: 'Expire ao subir. Inspire ao descer.',
        caution: 'Mesmas dicas da rosca normal. A pegada neutra (martelo) e mais gentil para os punhos. Ideal se tiver desconforto articular nas maos.'
      }
    ]
  },
  4: {
    dayName: 'Core + Equilibrio',
    dayLabel: 'Quinta-feira',
    icon: '🧘',
    gradient: 'grad-warning',
    exercises: [
      {
        id: 'd4e1',
        name: 'Prancha Modificada (Joelhos)',
        muscleGroup: 'Core',
        muscleEmoji: '🎯',
        sets: 3,
        reps: '20-30s',
        isometric: true,
        duration: 25,
        equipment: 'Tapete ou colchonete',
        youtubeId: 'TvxNkmjdhMM',
        startPosition: 'De brucos no chao, apoie-se nos antebracos e nos joelhos. Cotovelos sob os ombros. Corpo reto dos joelhos a cabeca.',
        execution: '1. Contraia o abdomen como se fosse levar o umbigo as costas.\n2. Mantenha a posicao estavel, sem deixar o quadril subir ou descer.\n3. Olhe para o chao para manter o pescoco neutro.\n4. Segure pelo tempo indicado.',
        breathing: 'Respire normalmente — nao prenda a respiracao. Inspire pelo nariz, expire pela boca de forma suave.',
        caution: 'Coloque uma toalha dobrada sob os joelhos para amortecer (especialmente o direito). Se a cervical doer, apoie a testa nas maos entrelacadas. Pare se sentir dor aguda.'
      },
      {
        id: 'd4e2',
        name: 'Bird-Dog (Cachorro-Passaro)',
        muscleGroup: 'Core / Equilibrio',
        muscleEmoji: '🎯',
        sets: 3,
        reps: 8,
        isometric: false,
        equipment: 'Tapete ou colchonete',
        youtubeId: 'wiFNA4ckjKM',
        startPosition: 'Posicao de quatro apoios: maos sob os ombros, joelhos sob o quadril. Costas retas.',
        execution: '1. Estenda o braco direito para frente e a perna esquerda para tras ao mesmo tempo.\n2. Mantenha o corpo estavel — sem girar o quadril.\n3. Segure 3 segundos.\n4. Volte devagar e troque (braco esquerdo + perna direita).\n5. Cada par = 1 repeticao.',
        breathing: 'Expire ao estender. Inspire ao voltar.',
        caution: 'Almofade o joelho direito com toalha. Se for muito dificil manter o equilibrio, comece fazendo so braco, depois so perna, antes de combinar.'
      },
      {
        id: 'd4e3',
        name: 'Equilibrio Unipodal',
        muscleGroup: 'Equilibrio / Estabilidade',
        muscleEmoji: '⚖️',
        sets: 3,
        reps: '20s cada perna',
        isometric: true,
        duration: 20,
        equipment: 'Cadeira proxima (seguranca)',
        youtubeId: 'xGR9bfGSdTU',
        startPosition: 'Em pe ao lado de uma cadeira (para se segurar se precisar). Pes juntos, postura ereta.',
        execution: '1. Transfira o peso para uma perna.\n2. Eleve o outro pe levemente do chao (5-10cm basta).\n3. Mantenha o equilibrio pelo tempo indicado.\n4. Troque de perna.',
        breathing: 'Respire normalmente, de forma calma e ritmica.',
        caution: 'Sempre tenha uma cadeira ou parede ao alcance. Comece com a perna esquerda (mais forte). Ao apoiar no joelho direito, se doer, flexione menos. Use sapato se o pe escorregar.'
      },
      {
        id: 'd4e4',
        name: 'Respiracao Diafragmatica',
        muscleGroup: 'Core profundo / Relaxamento',
        muscleEmoji: '🌬️',
        sets: 3,
        reps: '10 respiracoes',
        isometric: true,
        duration: 60,
        equipment: 'Nenhum',
        youtubeId: '0Ua9bOsZTYg',
        startPosition: 'Deitada de costas ou sentada confortavelmente. Uma mao no peito, outra na barriga.',
        execution: '1. Inspire lentamente pelo nariz por 4 segundos, enchendo a barriga (a mao da barriga sobe, a do peito fica parada).\n2. Segure 2 segundos.\n3. Expire pela boca por 6 segundos, esvaziando a barriga.\n4. Repita 10 vezes por serie.',
        breathing: 'Este exercicio E de respiracao. Inspire pelo nariz (4s), segure (2s), expire pela boca (6s).',
        caution: 'Se sentir tontura, volte a respirar normalmente. Nao force a expiracao. Este exercicio ajuda a relaxar a musculatura cervical — aproveite!'
      },
      {
        id: 'd4e5',
        name: 'Gato-Vaca (Cat-Cow)',
        muscleGroup: 'Mobilidade da coluna',
        muscleEmoji: '🐱',
        sets: 2,
        reps: 10,
        isometric: false,
        equipment: 'Tapete ou colchonete',
        youtubeId: 'kqnua4rHVVA',
        startPosition: 'Posicao de quatro apoios: maos sob os ombros, joelhos sob o quadril.',
        execution: '1. GATO: Arredonde as costas para cima, encolhendo o queixo em direcao ao peito. Contraia o abdomen.\n2. Segure 3 segundos.\n3. VACA: Abaixe a barriga em direcao ao chao, levantando a cabeca e o quadril. Abra o peito.\n4. Segure 3 segundos.\n5. Alterne suavemente entre as duas posicoes.',
        breathing: 'Inspire na posicao de Vaca (barriga para baixo). Expire na posicao de Gato (costas arredondadas).',
        caution: 'Movimento LENTO e SUAVE — especialmente na posicao de Vaca, nao force a cervical para tras. Olhe para o chao ao inves de olhar para cima. Almofade o joelho direito.'
      }
    ]
  },
  5: {
    dayName: 'Ombros + Bracos',
    dayLabel: 'Sexta-feira',
    icon: '🏅',
    gradient: 'grad-primary',
    exercises: [
      {
        id: 'd5e1',
        name: 'Elevacao Lateral com Garrafas',
        muscleGroup: 'Ombros',
        muscleEmoji: '🤸',
        sets: 3,
        reps: 12,
        isometric: false,
        equipment: '2 garrafas (500ml)',
        youtubeId: 'FeJP4E4Z0PQ',
        startPosition: 'Em pe ou sentada, bracos ao lado do corpo segurando as garrafas, palmas viradas para o corpo.',
        execution: '1. Eleve os bracos para os lados ate a altura dos ombros (formando um "T").\n2. Mantenha uma leve flexao nos cotovelos.\n3. Segure 1 segundo no topo.\n4. Desca lentamente.',
        breathing: 'Expire ao elevar. Inspire ao descer.',
        caution: 'Nao eleve acima dos ombros para proteger a articulacao. Use garrafas LEVES (500ml). Se o pescoco tensionar, faca sentada e use garrafas menores.'
      },
      {
        id: 'd5e2',
        name: 'Elevacao Frontal Alternada',
        muscleGroup: 'Ombros (frontal)',
        muscleEmoji: '🤸',
        sets: 2,
        reps: 10,
        isometric: false,
        equipment: '2 garrafas (500ml)',
        youtubeId: 'gzDSVHaNbRU',
        startPosition: 'Em pe ou sentada, bracos a frente das coxas segurando as garrafas, palmas viradas para as coxas.',
        execution: '1. Eleve um braco a frente ate a altura dos ombros, mantendo o braco quase esticado.\n2. Segure 1 segundo.\n3. Desca lentamente.\n4. Repita com o outro braco.\n5. Cada braco = 1 rep.',
        breathing: 'Expire ao elevar. Inspire ao descer.',
        caution: 'Nao balance o corpo. Mantenha o abdomen contraido. Se o ombro estalar ou doer, reduza a amplitude (suba menos).'
      },
      {
        id: 'd5e3',
        name: 'Encolhimento de Ombros com Garrafas',
        muscleGroup: 'Trapezio',
        muscleEmoji: '🤷',
        sets: 3,
        reps: 15,
        isometric: false,
        equipment: '2 garrafas (1L)',
        youtubeId: 'cJRVVxmytaM',
        startPosition: 'Em pe, bracos ao lado do corpo segurando as garrafas. Postura ereta, ombros relaxados.',
        execution: '1. Eleve os ombros em direcao as orelhas (como se dissesse "nao sei").\n2. Segure no topo por 2 segundos, apertando.\n3. Desca lentamente, relaxando completamente.\n4. Repita.',
        breathing: 'Expire ao encolher. Inspire ao relaxar.',
        caution: 'Este exercicio pode aliviar OU agravar a cervical. Comece com garrafas leves. Se sentir aumento de dor no pescoco, PARE e substitua por rotacoes suaves de ombro (sem peso).'
      },
      {
        id: 'd5e4',
        name: 'Rosca Concentrada',
        muscleGroup: 'Biceps',
        muscleEmoji: '💪',
        sets: 2,
        reps: 12,
        isometric: false,
        equipment: '1 garrafa (1L)',
        youtubeId: 'VMbH2Ql7TZk',
        startPosition: 'Sentada numa cadeira, pernas afastadas. Apoie o cotovelo do braco que vai trabalhar na parte interna da coxa. Segure a garrafa com a palma virada para cima.',
        execution: '1. Flexione o cotovelo, subindo a garrafa em direcao ao ombro.\n2. Suba o maximo que conseguir, apertando o biceps.\n3. Segure 1 segundo.\n4. Desca lentamente ate o braco ficar quase esticado.\n5. Faca todas as reps e troque de braco.',
        breathing: 'Expire ao subir. Inspire ao descer.',
        caution: 'Apoie bem o cotovelo na coxa para estabilizar. Se inclinar muito o tronco, pode forcar a cervical — mantenha a postura ereta.'
      },
      {
        id: 'd5e5',
        name: 'Triceps Coice com Garrafa',
        muscleGroup: 'Triceps',
        muscleEmoji: '💪',
        sets: 2,
        reps: 12,
        isometric: false,
        equipment: '1 garrafa (500ml ou 1L)',
        youtubeId: 'ZO81bExngMI',
        startPosition: 'Em pe, incline o tronco para frente (~45°), apoiando uma mao na cadeira. Outra mao segura a garrafa, cotovelo dobrado a 90° rente ao corpo.',
        execution: '1. Estenda o braco para tras, esticando o cotovelo.\n2. Aperte o triceps no final do movimento.\n3. Segure 1 segundo.\n4. Flexione o cotovelo devagar, voltando a 90°.\n5. Faca todas as reps e troque.',
        breathing: 'Expire ao estender. Inspire ao flexionar.',
        caution: 'Mantenha o cotovelo colado ao corpo. Nao jogue o braco — movimento controlado. Se a posicao inclinada incomodar a cervical, olhe para o chao e mantenha o pescoco neutro.'
      }
    ]
  },
  6: {
    dayName: 'Pernas Completo (Adaptado)',
    dayLabel: 'Sabado',
    icon: '🦵',
    gradient: 'grad-success',
    exercises: [
      {
        id: 'd6e1',
        name: 'Agachamento na Cadeira',
        muscleGroup: 'Quadriceps / Gluteos',
        muscleEmoji: '🦵',
        sets: 3,
        reps: 12,
        isometric: false,
        equipment: 'Cadeira firme',
        youtubeId: 'L-Vra2DVMF0',
        startPosition: 'Em pe, de costas para uma cadeira, pes na largura dos ombros. Bracos esticados a frente para equilibrio.',
        execution: '1. Flexione os joelhos e quadril como se fosse sentar na cadeira.\n2. Desca lentamente ate tocar levemente a cadeira (sem desabar).\n3. Assim que tocar, empurre o chao e suba.\n4. Mantenha os joelhos alinhados com os pes (nao deixe entrar para dentro).',
        breathing: 'Inspire ao descer. Expire ao subir.',
        caution: 'Fundamental para o joelho direito: nao deixe o joelho passar da ponta do pe. Se doer, nao desca ate a cadeira — faca meio agachamento. Coloque um travesseiro na cadeira para encurtar o movimento se necessario.'
      },
      {
        id: 'd6e2',
        name: 'Avanco Estatico (Lunge)',
        muscleGroup: 'Quadriceps / Gluteos',
        muscleEmoji: '🦵',
        sets: 2,
        reps: 10,
        isometric: false,
        equipment: 'Cadeira proxima (apoio)',
        youtubeId: 'UpI5jwrPJCo',
        startPosition: 'Em pe, de um passo a frente com uma perna. Pe de tras apoiado na ponta. Segure na cadeira para equilibrio se precisar.',
        execution: '1. Flexione ambos os joelhos, descendo o corpo.\n2. O joelho de tras desce em direcao ao chao (nao precisa encostar).\n3. O joelho da frente nao deve passar da ponta do pe.\n4. Suba empurrando com a perna da frente.\n5. Faca todas as reps e troque.',
        breathing: 'Inspire ao descer. Expire ao subir.',
        caution: 'Quando a perna direita estiver na frente, desca MENOS. Se o joelho direito protestar, substitua por elevacao de quadril. Segure na cadeira para equilibrio.'
      },
      {
        id: 'd6e3',
        name: 'Extensao de Joelho Sentada',
        muscleGroup: 'Quadriceps',
        muscleEmoji: '🦵',
        sets: 3,
        reps: 12,
        isometric: false,
        equipment: 'Cadeira',
        youtubeId: 'YyvSfVjQeL0',
        startPosition: 'Sentada numa cadeira, costas apoiadas, pes no chao. Maos segurando a borda da cadeira.',
        execution: '1. Estenda uma perna a frente ate ficar reta (paralela ao chao).\n2. Segure 2 segundos no topo, contraindo o quadriceps.\n3. Desca lentamente ate o pe quase tocar o chao.\n4. Repita e troque de perna.',
        breathing: 'Expire ao estender. Inspire ao descer.',
        caution: 'Exercicio EXCELENTE para fortalecer o joelho. Na perna direita, faca com menos amplitude se necessario. Fortalecer o quadriceps ajuda a proteger a articulacao do joelho com artrite.'
      },
      {
        id: 'd6e4',
        name: 'Panturrilha em Pe',
        muscleGroup: 'Panturrilha',
        muscleEmoji: '🦶',
        sets: 3,
        reps: 20,
        isometric: false,
        equipment: 'Parede ou cadeira (apoio)',
        youtubeId: 'gwLzBJYoWlI',
        startPosition: 'Em pe, segurando na parede ou cadeira. Pes na largura do quadril.',
        execution: '1. Fique na ponta dos pes, elevando os calcanhares o maximo possivel.\n2. Segure 2 segundos no topo.\n3. Desca lentamente ate os calcanhares quase tocarem o chao.\n4. Repita sem apoiar totalmente.',
        breathing: 'Expire ao subir. Inspire ao descer.',
        caution: 'Segure firme no apoio. Este exercicio NAO afeta o joelho — pode fazer sem restricao. Otimo para circulacao e equilibrio.'
      },
      {
        id: 'd6e5',
        name: 'Cadeirinha na Parede (Isometrico)',
        muscleGroup: 'Quadriceps / Gluteos',
        muscleEmoji: '🧱',
        sets: 3,
        reps: '20-30s',
        isometric: true,
        duration: 25,
        equipment: 'Parede lisa',
        youtubeId: 'y-wV4Lz6FJI',
        startPosition: 'Encoste as costas na parede. Deslize para baixo ate as coxas ficarem quase paralelas ao chao (ou ate onde for confortavel). Pes afastados na largura do quadril.',
        execution: '1. Mantenha a posicao, costas coladas na parede.\n2. Joelhos a 90° (ou menos, se o joelho direito doer).\n3. Segure pelo tempo indicado.\n4. Para sair, deslize para cima lentamente.',
        breathing: 'Respire normalmente. Nao prenda a respiracao!',
        caution: 'Nao desca tanto — para o joelho direito, mantenha o angulo dos joelhos ACIMA de 90° (mais aberto). Se doer, fique mais "em pe" contra a parede. A parede ajuda a proteger os joelhos pois tira peso da articulacao.'
      }
    ]
  }
};

// Mapeamento dia da semana → dia do treino
const DAY_MAP = {
  1: 1, // Segunda
  2: 2, // Terca
  3: 3, // Quarta
  4: 4, // Quinta
  5: 5, // Sexta
  6: 6, // Sabado
  0: 0  // Domingo = Descanso
};

// Frases motivacionais (100+ frases: fitness, biblicas, saude, do Dan)
const MOTIVATIONAL_QUOTES = [
  // ── Fitness (30) ──
  { text: 'Cada movimento conta. Voce esta ficando mais forte a cada dia!', author: 'Seu corpo agradece' },
  { text: 'O exercicio e a melhor medicina que existe.', author: 'Hipocrates' },
  { text: 'Nao e sobre ser perfeita, e sobre ser consistente.', author: 'Para Simone' },
  { text: 'Seu corpo pode fazer coisas incriveis. Confie nele.', author: 'Motivacao diaria' },
  { text: 'A dor de hoje e a forca de amanha.', author: 'Sabedoria fitness' },
  { text: 'Voce nao precisa ser rapida. Precisa ser constante.', author: 'Lembrete' },
  { text: 'Cada treino te deixa mais independente e confiante.', author: 'Verdade' },
  { text: 'Mexer o corpo e um ato de amor proprio.', author: 'Cuidado pessoal' },
  { text: 'Comece onde voce esta. Use o que tem. Faca o que pode.', author: 'Arthur Ashe' },
  { text: 'O unico treino ruim e o que nao foi feito.', author: 'Sabedoria popular' },
  { text: 'Quem se movimenta, vive melhor e mais feliz.', author: 'Ciencia' },
  { text: 'Seus ossos e articulacoes agradecem cada exercicio.', author: 'Seu corpo' },
  { text: 'Forca nao vem do corpo. Vem da vontade.', author: 'Mahatma Gandhi' },
  { text: 'Um passo de cada vez. Um exercicio de cada vez.', author: 'Paciencia' },
  { text: 'Voce e mais forte do que imagina, Simone!', author: 'Forca interior' },
  { text: 'A saude e construida diariamente, nao de uma vez.', author: 'Sabedoria' },
  { text: 'Hoje e um otimo dia para cuidar de voce.', author: 'Autocuidado' },
  { text: 'Mover-se e celebrar o que seu corpo pode fazer.', author: 'Gratidao' },
  { text: 'Quando sentir vontade de desistir, lembre-se do porque comecou.', author: 'Motivacao' },
  { text: 'Sua determinacao inspira!', author: 'Admiracao' },
  { text: 'O corpo foi feito para se mover. Honre o seu.', author: 'Sabedoria' },
  { text: 'Disciplina e escolher entre o que voce quer agora e o que quer mais.', author: 'Abraham Lincoln' },
  { text: 'Cada serie completada e uma vitoria.', author: 'Celebre!' },
  { text: 'Voce esta investindo na sua saude para os proximos 30 anos.', author: 'Futuro' },
  { text: 'Respire fundo. Voce consegue.', author: 'Calma e forca' },
  { text: 'O exercicio e um presente que voce da para o seu eu do futuro.', author: 'Presente' },
  { text: 'Nao compare sua jornada com a de ninguem. Essa e SUA historia.', author: 'Individualidade' },
  { text: 'A consistencia vence o talento quando o talento nao e consistente.', author: 'Tim Notke' },
  { text: 'Mente sa, corpo sao. Voce esta cuidando dos dois!', author: 'Equilibrio' },
  { text: 'Orgulhe-se de cada treino. Voce esta fazendo a diferenca.', author: 'Orgulho' },

  // ── Biblicas (40) ──
  { text: 'O Senhor e a minha forca e o meu escudo; nele o meu coracao confia, e dele recebo ajuda.', author: 'Salmos 28:7' },
  { text: 'Tudo posso naquele que me fortalece.', author: 'Filipenses 4:13' },
  { text: 'Aqueles que esperam no Senhor renovam as suas forcas. Voam alto como aguias.', author: 'Isaias 40:31' },
  { text: 'O Senhor e o meu pastor; nada me faltara.', author: 'Salmos 23:1' },
  { text: 'Nao temas, porque eu sou contigo; nao te assombres, porque eu sou o teu Deus.', author: 'Isaias 41:10' },
  { text: 'O coracao alegre e bom remedio, mas o espirito abatido seca os ossos.', author: 'Proverbios 17:22' },
  { text: 'Entrega o teu caminho ao Senhor; confia nele, e ele tudo fara.', author: 'Salmos 37:5' },
  { text: 'Porque eu, o Senhor teu Deus, te tomo pela tua mao direita e te digo: Nao temas, eu te ajudo.', author: 'Isaias 41:13' },
  { text: 'Lancai sobre ele toda a vossa ansiedade, porque ele tem cuidado de vos.', author: '1 Pedro 5:7' },
  { text: 'O Senhor e bom, e fortaleza no dia da angustia, e conhece os que nele confiam.', author: 'Naum 1:7' },
  { text: 'Porque Deus nao nos deu o espirito de temor, mas de fortaleza, de amor e de moderacao.', author: '2 Timoteo 1:7' },
  { text: 'Sou grata por ter sido feita de modo especial e maravilhoso.', author: 'Salmos 139:14' },
  { text: 'O Senhor te guardara de todo mal; ele guardara a tua alma.', author: 'Salmos 121:7' },
  { text: 'A paz vos deixo, a minha paz vos dou; nao vo-la dou como o mundo a da.', author: 'Joao 14:27' },
  { text: 'Buscai primeiro o reino de Deus e a sua justica, e as demais coisas vos serao acrescentadas.', author: 'Mateus 6:33' },
  { text: 'O Senhor e a minha luz e a minha salvacao; a quem temerei?', author: 'Salmos 27:1' },
  { text: 'Em tudo dai gracas, porque esta e a vontade de Deus em Cristo Jesus.', author: '1 Tessalonicenses 5:18' },
  { text: 'Deus e o nosso refugio e fortaleza, socorro bem presente na angustia.', author: 'Salmos 46:1' },
  { text: 'Confie no Senhor de todo o seu coracao e nao se apoie em seu proprio entendimento.', author: 'Proverbios 3:5' },
  { text: 'O Senhor te abencoe e te guarde; o Senhor faca resplandecer o seu rosto sobre ti.', author: 'Numeros 6:24-25' },
  { text: 'Mas os que esperam no Senhor renovarao as suas forcas e subirao com asas como aguias.', author: 'Isaias 40:31' },
  { text: 'Alegrem-se sempre no Senhor. Novamente direi: alegrem-se!', author: 'Filipenses 4:4' },
  { text: 'O amor e paciente, o amor e bondoso. Nao inveja, nao se vangloria, nao se orgulha.', author: '1 Corintios 13:4' },
  { text: 'Pois eu bem sei os planos que tenho para vos, diz o Senhor; planos de paz e nao de mal.', author: 'Jeremias 29:11' },
  { text: 'Bem-aventurados os que tem fome e sede de justica, porque eles serao fartos.', author: 'Mateus 5:6' },
  { text: 'O que para os homens e impossivel, para Deus e possivel.', author: 'Lucas 18:27' },
  { text: 'Sede fortes e corajosos. Nao temais, nem vos espanteis, pois o Senhor esta convosco.', author: '2 Cronicas 32:7' },
  { text: 'Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.', author: 'Mateus 11:28' },
  { text: 'O fruto do Espirito e: amor, alegria, paz, paciencia, amabilidade, bondade, fidelidade.', author: 'Galatas 5:22' },
  { text: 'A graca do Senhor Jesus Cristo seja com o vosso espirito.', author: 'Filipenses 4:23' },
  { text: 'O Senhor e misericordioso e compassivo, longanimo e assaz benigno.', author: 'Salmos 103:8' },
  { text: 'Ele sara os quebrantados de coracao e lhes penisa as feridas.', author: 'Salmos 147:3' },
  { text: 'Bendize, o minha alma, ao Senhor, e nao te esquecas de nenhum dos seus beneficios.', author: 'Salmos 103:2' },
  { text: 'Porque onde estiver o vosso tesouro, ali estara tambem o vosso coracao.', author: 'Mateus 6:21' },
  { text: 'Deus e amor; e quem permanece no amor permanece em Deus, e Deus nele.', author: '1 Joao 4:16' },
  { text: 'Clama a mim, e responder-te-ei, e anunciar-te-ei coisas grandes e firmes.', author: 'Jeremias 33:3' },
  { text: 'O Senhor pelejara por vos, e vos vos calareis.', author: 'Exodo 14:14' },
  { text: 'Porque os montes se retirarao, e os outeiros serao removidos; mas a minha benignidade nao se apartara de ti.', author: 'Isaias 54:10' },
  { text: 'O Senhor e fiel; ele os fortalecera e os protegera do Maligno.', author: '2 Tessalonicenses 3:3' },
  { text: 'Porque o Senhor Deus e sol e escudo; o Senhor da graca e gloria.', author: 'Salmos 84:11' },

  // ── Saude e bem-estar (15) ──
  { text: 'Dormir bem e tao importante quanto se exercitar. Cuide do seu sono.', author: 'Saude integral' },
  { text: 'A agua e o melhor remedio: hidrate-se todos os dias.', author: 'Dica de saude' },
  { text: 'Alongar-se pela manha prepara o corpo para um dia melhor.', author: 'Bem-estar' },
  { text: 'Rir e o melhor exercicio para a alma.', author: 'Sabedoria popular' },
  { text: 'Cuidar de si mesma nao e egoismo, e sobrevivencia.', author: 'Autocuidado' },
  { text: 'Uma caminhada de 20 minutos pode mudar todo o seu dia.', author: 'Movimento' },
  { text: 'Ouca seu corpo. Ele e sabio e sabe do que precisa.', author: 'Sabedoria do corpo' },
  { text: 'A alimentacao e o combustivel da saude. Escolha bem.', author: 'Nutricao' },
  { text: 'Respirar profundamente acalma a mente e fortalece o corpo.', author: 'Respiracao' },
  { text: 'Cada noite bem dormida e uma vitoria para sua saude.', author: 'Sono' },
  { text: 'O sol da manha e remedio natural: tome 15 minutos de sol por dia.', author: 'Vitamina D' },
  { text: 'Abracos liberam ocitocina — o hormonio da felicidade.', author: 'Ciencia do afeto' },
  { text: 'Prevenir e melhor que remediar. Seu treino e prevencao.', author: 'Medicina preventiva' },
  { text: 'Articulacoes saudaveis precisam de movimento. Continue se mexendo!', author: 'Reumatologia' },
  { text: 'Gratidao melhora a saude mental e fisica. Agradeca hoje.', author: 'Psicologia positiva' },

  // ── Do Dan (15) ──
  { text: 'Orgulho de voce, Mamusca!', author: 'Dan' },
  { text: 'Cada dia mais forte! Estou torcendo por voce.', author: 'Dan' },
  { text: 'Voce e a melhor mae do mundo. Cuide-se sempre.', author: 'Dan' },
  { text: 'Mamusca, voce e inspiracao pra todo mundo!', author: 'Dan' },
  { text: 'Eu e o Davi fizemos esse app com muito amor pra voce.', author: 'Dan' },
  { text: 'Nao desista! Voce ja provou que e guerreira.', author: 'Dan' },
  { text: 'Voce treinou hoje? Parabens! Cada dia conta.', author: 'Dan' },
  { text: 'Sua saude e o que mais importa pra gente, Mamusca.', author: 'Dan' },
  { text: 'Quando doer, lembre que voce esta ficando mais forte.', author: 'Dan' },
  { text: 'Eu sei que voce consegue. Acredito em voce!', author: 'Dan' },
  { text: 'Mamusca raiz nao pula treino! Vai la!', author: 'Dan' },
  { text: 'Voce e prova de que idade e so um numero.', author: 'Dan' },
  { text: 'Davi e eu te amamos demais. Cuide desse corpao!', author: 'Dan e Davi' },
  { text: 'Mais um treino concluido! A Simone e fera!', author: 'Dan' },
  { text: 'Voce esta cuidando de voce e isso me deixa muito feliz.', author: 'Dan' },

  // ── Extras ──
  { text: 'Lembre-se: ate os atletas comecaram do zero.', author: 'Perspectiva' },
  { text: 'Seu sorriso depois do treino vale mais que qualquer trofeu.', author: 'Felicidade' }
];

// Dicas de dor por regiao corporal
// Banco de audios (shuffle automatico). Pra adicionar novos:
// 1. Coloca em treino-simone/audio/ seguindo o padrao dan_frase_2.ogg, davi_postreino_2.ogg, etc
// 2. Adiciona o caminho no array correspondente abaixo
// 3. App faz shuffle automatico e evita repetir o ultimo
const AUDIO_LIBRARY = {
  welcome: {
    dan:  ['audio/dan_welcome.ogg'],
    davi: ['audio/davi_welcome.ogg']
  },
  frase: {
    dan:  ['audio/dan_frase.ogg'],
    davi: ['audio/davi_frase.ogg']
  },
  postreino: {
    dan:  ['audio/dan_postreino.ogg'],
    davi: ['audio/davi_postreino.ogg']
  }
};

const PAIN_TIPS = {
  cervical: [
    "Aplique compressa morna por 15-20 minutos na regiao do pescoco para aliviar a tensao.",
    "Faca mobilidade cervical suave: incline a orelha em direcao ao ombro, 15 segundos cada lado.",
    "Evite ficar olhando para baixo no celular por longos periodos — levante o aparelho na altura dos olhos.",
    "Ao dormir, use um travesseiro que mantenha o pescoco alinhado com a coluna. Nem muito alto nem muito baixo.",
    "Alongamento do trapezio: puxe suavemente a cabeca para o lado com a mao. 20 segundos cada.",
    "Se a dor persistir por mais de 3 dias ou piorar, consulte seu medico.",
    "Evite carregar bolsas pesadas em um ombro so — distribua o peso.",
    "Faca pausas a cada 30 minutos se estiver sentada. Levante e movimente o pescoco suavemente.",
    "Evite movimentos bruscos do pescoco (virar a cabeca de repente). Movimente-se devagar.",
    "Respiracao profunda relaxa a musculatura cervical — 5 inspiracoes lentas pelo nariz."
  ],
  joelho_direito: [
    "Aplique gelo por 15 minutos apos o exercicio se sentir inchaco ou calor no joelho.",
    "Evite ficar muito tempo sentada com o joelho flexionado. Estique a perna periodicamente.",
    "Fortalecimento do quadriceps protege o joelho — continue fazendo extensao de joelho sentada.",
    "Use calcado com bom amortecimento para caminhar. Evite chinelo ou sapato sem suporte.",
    "Ao subir escadas, lidere com a perna esquerda (boa). Ao descer, lidere com a direita.",
    "Se o joelho inchar, eleve a perna e aplique gelo. Nao force exercicios com dor aguda.",
    "Glucosamina e condroitina podem ajudar — converse com seu medico sobre suplementacao.",
    "Natacao e hidroginastica sao excelentes: a agua reduz 50-70% do peso nas articulacoes.",
    "Evite agachamentos profundos — flexione no maximo ate 90 graus pra proteger a cartilagem.",
    "Ao levantar da cadeira, use as maos nos bracos da cadeira pra reduzir carga no joelho."
  ],
  lombar: [
    "Alongamento gato-vaca: em quatro apoios, arredonde e arqueie as costas. 10 repeticoes suaves.",
    "Compressa morna por 20 minutos na lombar ajuda a relaxar a musculatura.",
    "Ao sentar, mantenha os pes apoiados no chao e costas encostadas na cadeira.",
    "Caminhada leve de 15-20 minutos pode aliviar dor lombar — o movimento lubrifica as articulacoes.",
    "Evite ficar sentada por mais de 1 hora seguida. Levante, alongue, caminhe um pouco.",
    "Durma de lado com um travesseiro entre os joelhos para alinhar a coluna.",
    "Respiracao diafragmatica ajuda a relaxar a musculatura da lombar. 10 respiracoes profundas.",
    "Se a dor irradiar para a perna, consulte o medico — pode ser compressao de nervo.",
    "Para pegar objetos no chao, flexione os joelhos (nao a coluna) — agache mantendo as costas retas.",
    "Fortalecer o core (abdomen) protege a lombar — priorize exercicios de prancha e ponte."
  ],
  ombro: [
    "Compressa morna por 15 minutos pode aliviar dor muscular no ombro.",
    "Faca circulos suaves com os ombros: 10 para frente, 10 para tras.",
    "Evite dormir sobre o ombro dolorido. Durma de costas ou do lado oposto.",
    "Pendule o braco relaxado para frente e para tras — movimento de pendulo alivia tensao.",
    "Se doer ao levantar o braco acima da cabeca, evite exercicios overhead ate melhorar.",
    "Alongue o peitoral na porta — braco apoiado no batente, gire o corpo para fora. 20 segundos.",
    "Evite carregar peso com o braco do ombro dolorido. Use o lado oposto ou distribua.",
    "Aplique gelo (15 min) apos atividade se houver inchaco ou dor aguda recente.",
    "Rotacao externa leve com elastico fortalece o manguito rotador — 10 repeticoes por dia.",
    "Se a dor irradiar pra o braco ou formigar a mao, procure ortopedista — pode ser nervo."
  ],
  geral: [
    "Beba bastante agua — a hidratacao ajuda na saude das articulacoes.",
    "Descanso e parte do treino. Nao force se estiver com dor aguda.",
    "Se a dor persistir por mais de uma semana, agende consulta com seu medico.",
    "Banho morno pode ajudar a relaxar a musculatura antes de dormir.",
    "Alongamento suave antes de dormir melhora a qualidade do sono.",
    "Dor de 0 a 3: pode treinar leve. Dor 4-6: reduza intensidade. Dor 7+: descanse e avalie.",
    "Omega-3 (peixe, linhaca) tem efeito anti-inflamatorio natural — inclua na dieta.",
    "Vitamina D e essencial pra saude ossea e articular. Exponha-se ao sol 15 min por dia.",
    "Perder 1kg alivia ate 4kg de carga nas articulacoes. Cuidar do peso ajuda muito.",
    "Registre a dor aqui todo dia — ajuda voce e seu medico a ver padroes de melhora ou piora."
  ]
};
