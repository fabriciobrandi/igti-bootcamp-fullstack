import express from "express";
import { promises } from "fs";

const router = express.Router();

const readFile = promises.readFile;
const writeFile = promises.writeFile;

router.post('/', async (req, res) => {
  let grade = req.body
  try {
    let json = await returnGrades();
    grade = { id: json.nextId++, timestamp: new Date(new Date() - 3600 * 1000 * 3).toISOString(), ...grade };
    json.grades.push(grade);

    await writeFile(global.fileName, JSON.stringify(json));
    res.send(grade);

    logger.info(`POST / grade - ${JSON.stringify(grade)}`)

  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`POST / grade - ${err.message}`)
  }
});

router.get('/', async (_req, res) => {
  try {
    let json = await returnGrades();
    delete json.nextId;
    res.send(json);
    logger.info(`GET / grade`)

  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`GET / grade - ${err.message}`)
  }
});

//Crie um endpoint para consultar uma grade em específico. Esse endpoint deverá receber como parâmetro o id da grade e retornar suas informações.
router.get('/:id', async (req, res) => {
  try {
    let json = await returnGrades();
    const grade = json.grades.find(grade => grade.id === parseInt(req.params.id, 10));
    if (grade) {
      res.send(grade)
    } else {
      res.end()
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`GET / grade /ID - ${err.message}`)
  }
});

//Crie um endpoint para consultar a nota total de um aluno em uma disciplina. O endpoint deverá receber como parâmetro o student e o subject, e realizar a soma de todas as notas de atividades correspondentes àquele subject, para aquele student. O endpoint deverá retornar a soma da propriedade value dos registros encontrados.
router.get('/sum/:student/:subject', async (req, res) => {
  try {
    let findGrade = req.params
    let json = await returnGrades();

    let gradesFiltered = json.grades.filter(grade => grade.student === findGrade.student && grade.subject === findGrade.subject);

    const sumGrades = gradesFiltered.reduce((acc, cur) => {
      return acc + cur.value
    }, 0);

    res.send({ Soma: sumGrades, timestamp: new Date(new Date() - 3600 * 1000 * 3).toISOString() });
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`PUT / grade - ${err.message}`)
  }
});

//Crie um endpoint para retornar as três melhores grades de acordo com determinado subject e type. O endpoint deve receber como parâmetro um subject e um type, e retornar um array com os três registros de maior value daquele subject e type. A ordem deve ser do maior para o menor.
router.get('/top/:subject/:type', async (req, res) => {
  try {
    let findGrade = req.params
    let json = await returnGrades();

    let gradesFiltered = json.grades.filter(grade => grade.subject === findGrade.subject && grade.type === findGrade.type);

    gradesFiltered.sort((a, b) => {
      return b.value - a.value;
    });
    res.send(gradesFiltered);

  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`PUT / grade - ${err.message}`)
  }
});
//Crie um endpoint para consultar a média das grades de determinado subject e type. O endpoint deverá receber como parâmetro um subject e um type, e retornar a média. A média é calculada somando o registro value de todos os registros que possuem o subject e type informados, dividindo pelo total de registros que possuem este mesmo subject e type.

router.get('/average/:subject/:type', async (req, res) => {
  try {
    let findGrade = req.params
    let json = await returnGrades();

    let gradesFiltered = json.grades.filter(grade => grade.subject === findGrade.subject && grade.type === findGrade.type);

    const sumGrades = gradesFiltered.reduce((acc, cur) => {
      return acc + cur.value
    }, 0);

    const formatNumber = (number) => {
      const numberFormat = Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });
      console.log('number' + number)
      return numberFormat.format(number);
    }
    let avg = sumGrades !== 0 ? formatNumber(sumGrades / gradesFiltered.length) : 0;
    res.send({ Media: avg });
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`PUT / grade - ${err.message}`)
  }
});


// Crie um endpoint para excluir uma grade. Esse endpoint deverá receber como parâmetro o id da grade e realizar sua exclusão do arquivo grades.json.

router.delete('/:id', async (req, res) => {
  try {
    let json = await returnGrades();
    const grades = json.grades.filter(grade => grade.id !== parseInt(req.params.id, 10));
    json.grades = grades;

    await writeFile(global.fileName, JSON.stringify(json))
    res.end();
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`DELETE / grade - ${err.message}`)
  }
});

// Crie um endpoint para atualizar uma grade.Esse endpoint deverá receber como parâmetros o id da grade a ser alterada e os campos student, subject, type e value.O endpoint deverá validar se a grade informada existe, caso não exista deverá retornar um erro.Caso exista, o endpoint deverá atualizar as informações recebidas por parâmetros no registro, e realizar sua atualização com os novos dados alterados no arquivo grades.json.

router.put('/', async (req, res) => {
  try {
    let newgrade = req.body
    let json = await returnGrades();
    let oldIndex = json.grades.findIndex(grade => grade.id === newgrade.id);

    if (oldIndex === -1) res.status(400).send({ error: 'id Inválido' });

    json.grades[oldIndex] = newgrade;

    await writeFile(global.fileName, JSON.stringify(json));
    res.end();
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`PUT / grade - ${err.message}`)
  }
});

router.post('/transaction', async (req, res) => {
  try {
    let params = req.body
    let json = await returnGrades();
    let index = json.grades.findIndex(grade => grade.id === params.id);

    if ((params.value < 0) && ((json.grades[index].balance + params.value) < 0)) {
      throw new Error('Não ha saldo suficiente');
    }

    json.grades[index].balance += params.value;

    await writeFile(global.fileName, JSON.stringify(json));
    res.send(json.grades[index]);

  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`TRANSACTION / grade - ${err.message}`)
  }
});


async function returnGrades() {
  let data = await readFile(global.fileName, 'utf8');
  return JSON.parse(data);
}

export default router

//module.exports = router;